from klein.app import Klein
from twisted.web.static import File
from geoffrey.api.server import app as api_server

app = Klein()


@app.route('/api/', branch=True)
def api(request):
    return api_server


@app.route('/', branch=True)
def statics(request):
    return File('./ui/dist/')


resource = app.resource
