from klein.app import Klein
from twisted.web.static import File
from geoffrey.api.server import app as api_server

import json

app = Klein()


@app.route('/api/', branch=True)
def api(request):
    return api_server.resource()


@app.route("/dashboard/server_config.js")
def config(request):
    return "window.GEOF_CONFIG = {}".format(
           json.dumps(app.get_server_settings()))


@app.route('/dashboard/', branch=True)
def statics(request):
    return File('./ui/dist/')

resource = app.resource
