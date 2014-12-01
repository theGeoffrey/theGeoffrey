from geoffrey.utils import get_params
from pprint import pprint
import yaml


class Config(dict):

    def __getattr__(self, attr):
        return get_params(self, attr)

    def __setstate__(self, state):
        self.update(state)


with open("config.yml", "r") as reader:
    CONFIG = Config(**yaml.load(reader.read()))


def get_db_master_config():
    return dict(user=CONFIG.COUCH_ADMIN_USER,
                password=CONFIG.COUCH_ADMIN_PASSWORD,
                url="http://" + CONFIG.COUCHDB_DOMAIN)
