
from geoffrey import config
from geoffrey.api.server import app

app.run(config.API_SERVER_HOST, config.API_SERVER_PORT)
