from twisted.internet import defer
from twisted.python import log
from werkzeug.exceptions import Unauthorized

from klein import Klein

from geoffrey import __version__
from geoffrey.config import CONFIG
from geoffrey.utils import get_active_services_for_api
from geoffrey import tasks

import json
import treq


def auth_wrapper(func):
    def get_by_key(self, request, key):
        def _set_on_request(cfg):
            request.config = cfg
            return request

        def _replace_error(failure):
            log.err(failure)
            raise Unauthorized()

        dfr = defer.maybeDeferred(func, self, key)
        dfr.addCallback(_set_on_request)
        dfr.addErrback(_replace_error)
        return dfr
    return get_by_key


class GeoffreyApi(Klein):

    def _get_config(self, db, user=CONFIG.COUCH_ADMIN_USER,
                    password=CONFIG.COUCH_ADMIN_PASSWORD):
        target = "http://{}/{}/CONFIG".format(CONFIG.COUCHDB_DOMAIN, db)

        def set_database(config):
            config['database'] = db
            return config

        return treq.get(target, auth=(user, password)
                        ).addCallback(lambda x: x.json()
                        ).addCallback(set_database)

    @auth_wrapper
    def _get_by_api_key(self, api_key):
        access, database = api_key.split("@", 1)
        user, password = access.split(":", 1)
        return self._get_config(database, user, password)

    @auth_wrapper
    def _get_by_public_key(self, pkey):
        return self._get_config(pkey)

    def secure(self, func):
        def secured(request):
            key = request.args.get('key', [None])[0]
            if not key:
                raise Unauthorized()
            return self._get_by_api_key(request, key).addCallback(func)
        secured.func_name = func.func_name
        return secured

    def public(self, func):
        def secured_public(request):
            key = request.args.get('public_key', [None])[0] or request.form.get('public_key', [None])[0]
            if not key:
                raise Unauthorized()
            return self._get_by_public_key(request, key).addCallback(func)
        secured_public.func_name = func.func_name
        return secured_public


app = GeoffreyApi()


@app.route('/users/add', methods=["POST"])
@app.secure
def add_user(request):

    payload = json.loads(request.content.read())

    for func in get_active_services_for_api(request.config, 'add_user', tasks):
        func.delay(request.config, payload)

    return '{"succeed": true}'


@app.route('/posts/new', methods=["POST"])
@app.secure
def add_post(request):

    payload = json.loads(request.content.read())

    for func in get_active_services_for_api(request.config, 'new_post', tasks):
        func.delay(request.config, payload)

    return '{"succeed": true}'


@app.route('/forms/add', methods=['POST'])
@app.public
def add_form(request):
    for func in get_active_services_for_api(request.config, 'add_form', tasks):
        func.delay(request.config, request.form)

    return '{"succeed": true}'


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
