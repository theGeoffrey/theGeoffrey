from klein import Klein
from geoffrey import __version__

app = Klein()

@app.route('/ping')
def ping(request):
    return 'Hello, world!'


@app.route('/version')
def version(request):
    return 'This runs Geoffrey %s' % __version__

