
from twisted.internet import defer
from twisted.python import log

from werkzeug.exceptions import Unauthorized

from klein import Klein

from geoffrey import __version__
from geoffrey.config import CONFIG, get_database_connection
from geoffrey.utils import get_active_services_for_api, db_now
from geoffrey.services import chat
from geoffrey import tasks

import json

SUCCESS = '{"success": true}'


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

    def _get_param(self, key_name, request, kwargs):
        value = None
        if key_name in kwargs:
            value = kwargs[key_name]
        elif key_name in request.args:
            value = request.args[key_name][0]
        elif request.method in ['POST', 'PUT'] and key_name in request.form:
            value = request.form[key_name][0]

        if value is None:
            raise Unauthorized()
        return value

    def secure(self, func):
        def secured(request, **kwargs):
            key = self._get_param('key', request, kwargs)
            return self._get_by_api_key(request, key
                ).addCallback(func, **kwargs)
        secured.func_name = func.func_name
        return secured

    def public(self, func):
        def secured_public(request, **kwargs):
            key = self._get_param('public_key', request, kwargs)
            return self._get_by_public_key(request, key
                    ).addCallback(func, **kwargs)
        secured_public.func_name = func.func_name
        return secured_public

    def with_session(self, func):

        def loading_session(request, **kwargs):
            def set_session(session_data):
                # FIXME: this should be one-time tokens, too
                request.session = session_data
                return request

            key = self._get_param('session', request, kwargs)
            return request.db_client.get(key
                       ).addCallback(set_session
                       ).addCallback(func, **kwargs)
        loading_session.func_name = func.func_name
        return loading_session


app = GeoffreyApi()


@app.route('/users/add', methods=["POST"])
@app.secure
def add_user(request):

    payload = json.loads(request.content.read())

    for func in get_active_services_for_api(request.config, 'add_user', tasks):
        func.delay(request.config, payload)

    return SUCCESS


@app.route('/session/create', methods=["POST"])
@app.secure
def create_session(request):
    payload = json.loads(request.content.read())
    payload['type'] = 'session'
    payload['created'] = db_now()
    return request.db_client.post(data=json.dumps(payload)
        ).addCallback(lambda x: json.dumps(x))


@app.route('/apps/chat/<public_key>/<session>/', branch=True)
@app.public
@app.with_session
def chat_receive(request, **kwargs):
    return chat.receiver(request)


def _api_trigger_wrapper(name):
    def _wrapped(request):

        payload = json.loads(request.content.read())

        for func in get_active_services_for_api(request.config, name, tasks):
            func.delay(request.config, payload)

        return SUCCESS
    _wrapped.func_name = name
    return app.secure(_wrapped)


for item in ["post", "topic"]:
    app.route('/trigger/{}/new'.format(item), methods=["POST"])(
        _api_trigger_wrapper("trigger_{}_new".format(item)))

    app.route('/trigger/{}/update'.format(item), methods=["POST"])(
        _api_trigger_wrapper("trigger_{}_update".format(item)))


@app.route('/forms/add', methods=['POST'])
@app.public
def add_form(request):
    for func in get_active_services_for_api(request.config, 'add_form', tasks):
        func.delay(request.config, request.form)

    return SUCCESS


@app.route("/embed_config.json")
@app.public
def embed_config(request):
    # ask the apps what to send...
    json_p = request.args.get('json_p', [None])[0] or "__startGeoffrey"
    return "{}({});".format(json_p,
                            json.dumps({'config': request.config}))


@app.route("/server_config.json")
def config(request):
    return """window.GEOF_CONFIG = {
      COUCHDB_DOMAIN: "{}"
    }""".format(CONFIG.COUCHDB_DOMAIN)


@app.route('/ping')
@app.secure
def ping(request):
    return 'Your API key is:{}'.format(request.config['dc_url'])


@app.route('/version')
def version(request):
    return 'This runs Geoffrey %s' % __version__
