
from nose.twistedtools import reactor, deferred

from geoffrey.helpers import get_database_connection
from twisted.python import log
from twisted.internet import defer, reactor

import twisted.trial.unittest

from unittest import SkipTest
from os import environ

from urllib import quote

import treq
import uuid
import json




class IntegrationTestMixin(object):

    ENVIRONMENT_KEYS = ["INTEGRATION_TESTS"]

    @classmethod
    def setUpClass(cls):
        for key in cls.ENVIRONMENT_KEYS:
            try:
                if environ[key] in ["n", '0', 0, 'f', 'false', 'no']:
                    raise ValueError
            except (KeyError, ValueError):
                raise SkipTest('Integration Test Disabled. Add {} to ENV to activate.'.format(key))

def gimme(res):
    print(res)
    return res


class ServerTestMixin(IntegrationTestMixin):

    ENVIRONMENT_KEYS = IntegrationTestMixin.ENVIRONMENT_KEYS + ["GEOFFREY_URL"]

    _CONFIG = {"_id": "CONFIG", "dc_url": "ABCD"}

    @classmethod
    @deferred(timeout=5.0)
    def setUpClass(cls):
        IntegrationTestMixin.setUpClass()

        cls.__DB_NAME = environ.get("COUCHDB_DB", "test-geoffrey-" + uuid.uuid4().hex)

        cls.__DB = DB = get_database_connection(cls.__DB_NAME,
                    user=environ.get("COUCHDB_ADMIN_USER", None),
                    password=environ.get("COUCHDB_ADMIN_PW", None),
                    base_url=environ.get("COUCHDB_BASE_URL", None),
                    defaults=dict(persistent=False))

        def _reset_config(*args, **kwargs):
            return DB.put("CONFIG", data=json.dumps(cls._CONFIG))

        return DB.createDB().addCallback(_reset_config)

    @classmethod
    @deferred(timeout=5.0)
    def tearDownClass(cls):
        return cls.__DB.deleteDB()

    def _get_api_key(self):
        return "{}:{}@{}".format(self.__class__.__DB.auth[0],
                                 self.__class__.__DB.auth[1], self.__class__.__DB_NAME)

    def _get_public_key(self):
        return self.__class__.__DB_NAME

    def _make_request(self, path, method='GET', _is_json=False,
                      _append_public_key=False, _append_api_key=False,
                      _accepted_codes=[200], **kwargs):

        params = kwargs.pop('params', {})

        url = environ['GEOFFREY_URL'] + path
        if _append_public_key:
            params['publickey'] = self._get_public_key()

        if _append_api_key:
            params['key'] = self._get_api_key()

        def read_stream(response):
            self.assertIn(response.code, _accepted_codes,
                          "Got unexpected response code {} for {}:{}. ".format(response.code,
                          method, url))
            if _is_json:
                return response.json()
            return response.text()

        return treq.request(method, url, params=params,
                            persistent=False, **kwargs
                            ).addCallback(read_stream)

