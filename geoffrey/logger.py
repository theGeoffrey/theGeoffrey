

from geoffrey.config import CONFIG
from geoffrey.helpers import get_database_connection
from geoffrey.utils import db_now
from twisted.python import failure, log
import json


class CouchdbLogger(object):

    def __init__(self, config, system=None):
        self.client = get_database_connection(config['database'],
                                              CONFIG.COUCHDB_LOGGER_USER,
                                              CONFIG.COUCHDB_LOGGER_PASSWORD)
        self.config = config
        self.system = system

    def _check_response(self, response):
        assert not 'error' in response, \
            "Writing message failed {}".format(response)

    def log(self, message, **payload):
        return self._log('LOG', message, **payload)

    def warn(self, message, **payload):
        return self._log('WARN', message, **payload)

    def err(self, _stuff=None, message=None, **payload):
        if _stuff is None:
            _stuff = failure.Failure()
        elif isinstance(_stuff, Exception):
            _stuff = failure.Failure(_stuff)

        payload['traceback'] = _stuff.getTraceback()
        return self._log('ERROR',
                         message or 'Unhandled Error',
                         **payload)

    def _log(self, severity, message, _log_errors=True, **payload):
        content = {'type': "log",
                   'severity': severity,
                   'when': db_now(),
                   'system': self.system,
                   'message': message,
                   'payload': payload}

        if 'traceback' in payload:
            content['traceback'] = payload.pop('traceback')

        dfr = self.client.post('', data=json.dumps(content)
                               ).addCallback(self._check_response)

        if _log_errors:
            dfr.addCallback(log.err)

        return dfr
