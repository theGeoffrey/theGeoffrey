from klein.app import Klein
from twisted.web.static import File
from twisted.web import proxy
from geoffrey.api.server import app as api_server

import json

app = Klein()


@app.route('/api/', branch=True)
def api(request):
    return api_server.resource()


@app.route("/server_config.js")
def config(request):
    return "window.GEOF_CONFIG = {}".format(
           json.dumps(app.get_server_settings()))



if CONFIG.DEBUG:

    @app.route('/assets/', branch=True)
    def assets(request):
        return proxy.ReverseProxyResource('localhost', 8092, '/assets')

    @app.route('/dashboard/', branch=False)
    def dashboard(request):
        return proxy.ReverseProxyResource('localhost', 8092, '')

else:

    @app.route('/assets/', branch=True)
    def assets(request):
        return File('./ui/dist/assets/')

    @app.route('/dashboard/', branch=False)
    def dashboard(request):
        return File('./ui/dist/')

resource = app.resource
