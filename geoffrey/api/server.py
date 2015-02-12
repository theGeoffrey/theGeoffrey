
from twisted.internet import defer
from twisted.python import log

from datetime import timedelta, datetime

from werkzeug.exceptions import Unauthorized, BadRequest, NotFound

from klein import Klein

from geoffrey import __version__
from geoffrey.config import CONFIG
from geoffrey.helpers import get_database_connection, get_request_param
from geoffrey.utils import (get_active_services_for_api, db_now,
                            db_date_format, db_date_parse)
from geoffrey import tasks
from urlparse import urlparse

import json

SUCCESS = '{"success": true}'
FAILURE = '{"success": false}'


def auth_wrapper(func):
    def get_by_key(self, request, key):
        def _set_on_request(cfg):
            request.config = cfg
            return request

        def _replace_error(failure):
            log.err(failure)
            raise Unauthorized()

        dfr = defer.maybeDeferred(func, self, request, key)
        dfr.addCallback(_set_on_request)
        dfr.addErrback(_replace_error)
        return dfr
    return get_by_key


class GeoffreyApi(Klein):

    def _get_config(self, request, db, user=CONFIG.COUCH_USER,
                    password=CONFIG.COUCH_PASSWORD):

        client = get_database_connection(db, user, password)

        def set_database(config):
            config['database'] = db
            request.db_client = client
            return config

        return client.get('CONFIG').addCallback(set_database)

    @auth_wrapper
    def _get_by_api_key(self, request, api_key):
        access, database = api_key.split("@", 1)
        user, password = access.split(":", 1)
        return self._get_config(request, database, user, password)

    @auth_wrapper
    def _get_by_public_key(self, request, pkey):
        return self._get_config(request, pkey)

    def secure(self, func):
        def secured(request, **kwargs):
            key = get_request_param('key', request, kwargs)
            return self._get_by_api_key(request, key
                ).addCallback(func, **kwargs)
        secured.func_name = func.func_name
        return secured

    def public(self, func):
        def secured_public(request, **kwargs):
            key = get_request_param('public_key', request, kwargs)
            return self._get_by_public_key(request, key
                    ).addCallback(func, **kwargs)
        secured_public.func_name = func.func_name
        return secured_public

    def with_session(self, func):

        def loading_session(request, **kwargs):
            def set_session(session_data):
                if not session_data.get("permanent", False) and \
                        datetime.utcnow() > db_date_parse(session_data["valid_until"]):
                    raise NotFound()
                request.session = session_data
                return request

            key = get_request_param('session', request, kwargs)
            return request.db_client.get(key
                       ).addCallback(set_session
                       ).addCallback(func, **kwargs)
        loading_session.func_name = func.func_name
        return loading_session

    def _api_trigger_wrapper(self, name):
        def _wrapped(request):

            payload = json.loads(request.content.read()) if request.content else None

            for func in get_active_services_for_api(request.config, name, tasks):
                func.delay(request.config, payload)

            return SUCCESS
        _wrapped.func_name = name

        return self.secure(_wrapped)

    def trigger_route(self, item):

        self.route('/trigger/{}/new'.format(item), methods=["POST"])(
            self._api_trigger_wrapper("{}_new".format(item)))

        self.route('/trigger/{}/update'.format(item), methods=["POST"])(
            self._api_trigger_wrapper("{}_update".format(item)))

    def trigger_scheduler_route(self, item):

        self.route('/trigger/{}/schedule'.format(item), methods=["GET"])(
            self._api_trigger_wrapper("{}_schedule".format(item)))

    def get_server_settings(self, request):
        domain = ""
        if hasattr(request, "config"):
            domain = urlparse(request.config['dc_url']).hostname

        settings = {"capabilities": {},
                    "chat_domain": domain,
                    "COUCH": {
                        "DOMAIN": CONFIG.COUCHDB_DOMAIN,
                        "PROTO": CONFIG.get('COUCH_PROTO') or 'http'},
                    "version": __version__,
                    }
        return settings


app = GeoffreyApi()


# Default trigger API
for item in ["post", "topic", "user"]:
    app.trigger_route(item)

for item in ["1h", "24h"]:
    app.trigger_scheduler_route(item)

@app.route('/session/create', methods=["POST"])
@app.secure
def create_session(request):
    payload = json.loads(request.content.read())

    if not "username" in payload:
        raise BadRequest("You need to provide a username")

    if "_id" in payload:
        raise BadRequest("'_id' is not allowed in paylod")

    payload['type'] = 'session'
    payload['created'] = db_now()

    schedule_deletion = False

    if payload.get("permanent", None):
        payload.pop("timeout", None)
        payload.pop("valid_until", None)
    else:
        timeout = payload.pop("timeout", CONFIG.DEFAULT_SESSION_TIMEOUT)
        payload['valid_until'] = db_date_format(timedelta(seconds=timeout))

    dfr = request.db_client.post(data=json.dumps(payload))

    def schedule_delete(session):
        tasks.purge_document.apply_async(
                (request.db_client.db_name, session["_id"]),
                countdown=timeout)
        return session

    if schedule_deletion:
        dfr.addCallback(schedule_delete)

    return dfr.addCallback(lambda x: json.dumps({"success": True, "id": x['id']}))


@app.route('/session/<public_key>/<session>/confirm/')
@app.public
@app.with_session
def confirm_session_pair(request, **kwargs):
    for key, value in request.args.iteritems():
        if request.session.get(key, None) != value:
            break
    else:
        # none broke, we are good to return true
        return "true"
    return "false"


@app.route('/forms/add', methods=['POST'])
@app.public
def add_form(request):
    for func in get_active_services_for_api(request.config, 'add_form', tasks):
        func.delay(request.config, request.form)

    return SUCCESS


@app.route("/start_embed.js")
@app.public
def embed_config(request):
    json_p = request.args.get('json_p', [None])[0] or "__startGeoffrey"
    # FIXME: ask the apps what to send...
    settings = app.get_server_settings(request)
    return "{}({});".format(json_p, json.dumps(settings))


@app.route('/ping')
@app.secure
def ping(request):
    return 'Your Domain is:{}'.format(request.config['dc_url'])


@app.route('/version')
def version(request):
    return 'This runs Geoffrey {}'.format(__version__)
