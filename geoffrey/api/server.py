from werkzeug.exceptions import Unauthorized
from klein import Klein
from geoffrey import __version__
from geoffrey import config


class GeoffreyApi(Klein):

    def _get_config(self, request):
        """
        Checks and returns the proper configuration for the request|

        raises l{werkzeug.exceptions.Unauthorized} if the key given
        in the request doesn't match the API_KEY specified in the
        config
        """
        api_key = request.args.get("key", [None])[0]
        if not api_key or config.API_KEY != api_key:
            raise Unauthorized()
        return config

app = GeoffreyApi()


@app.route('/ping')
def ping(request):
    config = app._get_config(request)
    return 'Your API key is:{}'.format(config.API_KEY)


@app.route('/version')
def version(request):
    return 'This runs Geoffrey %s' % __version__



