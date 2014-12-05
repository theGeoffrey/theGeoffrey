from twisted.internet import defer
from twisted.python import log
from werkzeug.exceptions import Unauthorized

from klein import Klein

from geoffrey import __version__
from geoffrey.config import CONFIG, get_database_connection
from geoffrey.utils import get_active_services_for_api, db_now
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

    def _get_config(self, request, db, user=CONFIG.COUCH_ADMIN_USER,
                    password=CONFIG.COUCH_ADMIN_PASSWORD):

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

    def with_session(self, func):

        def loading_session(request):
            def set_session(session_data):
                # FIXME: this should be one-time tokens, too
                request.session = session_data
                return request

            session = request.args.get('session', [None])[0] or request.form.get('session', [None])[0]
            if not session:
                raise Unauthorized()

            return request.db_client.get(session
                       ).addCallback(set_session
                       ).addCallback(func)
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


@app.route('/apps/chat', methods=["GET"])
@app.public
@app.with_session
def chat_receive(request):
    user = request.session['user']
    def fetch_and_post(json_data):
        results = json_data['results']
        if not results: return SUCCESS
        return json.dumps(results[-1]['changes'][0])

    return request.db_client.get(
            "_changes?filter=chat/my_messages&feed=longpoll&name={}?since=65".format(user)
            ).addCallback(fetch_and_post)


@app.route('/apps/chat', methods=["POST"])
@app.secure
def chat_create(request):
    payload = json.loads(request.content.read())
    message = {'type': 'chat',
               'to': payload['to'],
               'from': payload['from'],
               'message': payload['message'],
               'when': db_now()}
    return request.db_client.post(data=json.dumps(message)
            ).addCallback(lambda x: SUCCESS)


@app.route('/posts/new', methods=["POST"])
@app.secure
def add_post(request):

    payload = json.loads(request.content.read())

    for func in get_active_services_for_api(request.config, 'new_post', tasks):
        func.delay(request.config, payload)

    return SUCCESS


@app.route('/forms/add', methods=['POST'])
@app.public
def add_form(request):
    for func in get_active_services_for_api(request.config, 'add_form', tasks):
        func.delay(request.config, request.form)

    return SUCCESS


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
