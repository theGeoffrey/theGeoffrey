from geoffrey.utils import get_params
from geoffrey.couchdb_connection import CouchdbConnection

from urlparse import urlparse

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

if "GEOFFREY_PRODUCTION" in os.environ:
    CONFIG["DEBUG"] = False

if "COUCH_URL" in os.environ:
    couch_url = urlparse(os.environ['COUCH_URL'])

    CONFIG['COUCH_PROTO'] = couch_url.scheme
    CONFIG['COUCHDB_DOMAIN'] = "{}:{}".format(couch_url.hostname,
                                              couch_url.port or 5984)
    if couch_url.username:
        CONFIG['COUCHDB_LOGGER_USER'] = CONFIG['COUCH_USER'] = couch_url.username

    if couch_url.password:
        CONFIG['COUCHDB_LOGGER_PASSWORD'] = CONFIG['COUCH_PASSWORD'] = couch_url.password


if CONFIG["DEBUG"]:
    from pprint import pprint
    print("LOADED CONFIG:")
    pprint(CONFIG)