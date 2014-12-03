from nose.twistedtools import reactor, deferred
from unittest import TestCase
from geoffrey.logger import CouchdbLogger

# import os


class TestCouchdbLogger(TestCase):

    def setUp(self):
        # url = os.getenv("DB_TEST_DOMAIN")
        # if not url:
        #     self.skipTest("No database URL set. Please set DB_TEST_URL")
        #     return

        self.logger = CouchdbLogger({'database': 'geoffrey'}, 'IntegrationTest')


    @deferred()
    def test_logging(self):
        # FIXME: add check to receive data
        return self.logger.log('Test Message', _log_errors=False)

    @deferred()
    def test_logging_with_payload(self):
        # FIXME: add check to receive data
        return self.logger.log('Test Message',
                               _log_errors=False,
                               user_id=1)

    @deferred()
    def test_error(self):
        # FIXME: add check to receive data
        try:
            "abc"[12]
        except Exception as exc:
            return self.logger.err(exc,
                                   'We wanted to fail here',
                                   _log_errors=False)


    # def test_error_logging(self)