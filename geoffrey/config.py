from geoffrey.utils import get_params
from geoffrey.couchdb_connection import CouchdbConnection

import yaml
import os


class Config(dict):

    def __getattr__(self, attr):
        return get_params(self, attr)

    def __setstate__(self, state):
        self.update(state)


def _recursive_replace(config, prefix=''):
    for key in config:
        if isinstance(config[key], dict):
            _recursive_replace(config[key], prefix=prefix + key + "__")
        elif prefix+key in os.environ:
            config[key] = os.environ[prefix+key]

    return config


with open("config.yml", "r") as reader:
    CONFIG = _recursive_replace(Config(**yaml.load(reader.read())))

if "REDIS_URL" in os.environ:
    redis_url = os.environ['REDIS_URL']
    CONFIG.CELERY.update({
        "BROKER_URL": "{}/0".format(redis_url),
        "CELERY_RESULT_BACKEND": "{}/1".format(redis_url)
        })

if "COUCH_URL" in os.environ:
    couch_domain = os.environ['COUCH_URL'].split("@", 1)[1]
    couch_proto = os.environ['COUCH_URL'].split("://", 1)[0]
    if couch_domain:
        CONFIG['COUCHDB_DOMAIN'] = couch_domain
    if couch_proto:
        CONFIG['COUCH_PROTO'] = couch_proto
