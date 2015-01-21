
from unittest import SkipTest
from os import environ


class IntegrationTestMixin(object):

    ENVIRONMENT_KEYS = ["INTEGRATION_TESTS"]

    @classmethod
    def setupClass(cls):
        for key in cls.ENVIRONMENT_KEYS:
            try:
                if environ[key] in ["n", '0', 0, 'f', 'false', 'no']:
                    raise ValueError
            except (KeyError, ValueError):
                raise SkipTest('Integration Test Disabled. Add {} to ENV to activate.'.format(key))

