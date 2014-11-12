from werkzeug.exceptions import Unauthorized
from twisted.internet import defer
from klein import Klein
from geoffrey import __version__
from geoffrey.config import CONFIG
import json

class GeoffreyApi(Klein):

    def _get_config(self, request):
        """
        Checks and returns the proper configuration for the request|

        raises l{werkzeug.exceptions.Unauthorized} if the key given
        in the request doesn't match the API_KEY specified in the
        config
        """
        api_key = request.args.get("key", [None])[0]
        if not api_key or CONFIG.API_KEY != api_key:
            raise Unauthorized()
        request.config = CONFIG
        return defer.succeed(request)

    def secure(self, func):
        def secured(request):
            return self._get_config(request).addCallback(func)
        secured.func_name = func.func_name
        return secured

app = GeoffreyApi()


@app.route('/users/add', methods=["POST"])
@app.secure
def add_user(request):
    payload = json.loads(request.content.read())
    return "Received User ID: {}".format(payload['user_id'])


@app.route('/ping')
@app.secure
def ping(request):
    return 'Your API key is:{}'.format(request.config.API_KEY)


@app.route('/version')
def version(request):
    return 'This runs Geoffrey %s' % __version__
