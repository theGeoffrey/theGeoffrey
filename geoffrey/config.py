from geoffrey.utils import get_params
from geoffrey.couchdb_connection import CouchdbConnection
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


def get_database_connection(db, user=None, password=None, base_url=None):
    return CouchdbConnection(db, user=user or CONFIG.COUCH_ADMIN_USER,
                             password=password or CONFIG.COUCH_ADMIN_PASSWORD,
                             base_url=base_url or "http://" + CONFIG.COUCHDB_DOMAIN)
