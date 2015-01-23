import treq
from urllib import urlencode

from twisted.internet import error, defer
from twisted.protocols import basic

import json

class CouchdbConnectionError(Exception): pass

class CouchdbConnection(object):

    def __init__(self, database, user=None, password=None,
                 base_url="http://localhost:5984"):

        self.auth = None
        if user:
            self.auth = (user, password)

        if not base_url.endswith('/'):
            base_url += "/"

        self.url = base_url + database

    def _parse_response(self, response, expect_ok=False,
                        accepted_codes=[200, 201],
                        _method=None, _document=None):

        def render_error(err_data):
            msg = "Error {} when trying to {} {}: {}"
            raise CouchdbConnectionError(msg.format(response.code,
                                                    _method, _document,
                                                    err_data))

        if response.code not in accepted_codes:
            return response.text().addCallback(render_error)

        def _is_ok(content):
            assert content["ok"]
            return content

        dfr = response.json()
        if expect_ok:
            dfr.addCallback(_is_ok)
        return dfr

    def _update_kwargs(self, kwargs):
        if self.auth:
            if not 'auth' in kwargs:
                kwargs['auth'] = self.auth

        headers = kwargs.get('headers', {})
        headers.update({'Content-Type': ['application/json']})
        kwargs['headers'] = headers
        return kwargs

    def get(self, document="", **kwargs):
        return self.raw_get(document, **kwargs
                            ).addCallback(self._parse_response,
                                          _method="GET",
                                          _document=document)

    def raw_get(self, document="", **kwargs):
        return treq.get("{}/{}".format(self.url, document),
                        **self._update_kwargs(kwargs)
                        )

    def post(self, document="", **kwargs):
        return self.raw_post(document, **kwargs
                             ).addCallback(self._parse_response,
                                           expect_ok=True,
                                           _method="POST",
                                           _document=document)

    def raw_post(self, document="", **kwargs):
        return treq.post("{}/{}".format(self.url, document),
                         **self._update_kwargs(kwargs))

    def put(self, document="", **kwargs):
        return self.raw_put(document, **kwargs
                            ).addCallback(self._parse_response,
                                          expect_ok=True,
                                          _method="PUT",
                                          _document=document)

    def raw_put(self, document, **kwargs):
        return treq.put("{}/{}".format(self.url, document),
                        **self._update_kwargs(kwargs))

    def delete(self, document="", **kwargs):
        return self.raw_delete(document, **kwargs
                               ).addCallback(self._parse_response,
                                             _method="DELETE",
                                             _document=document)

    def raw_delete(self, document, **kwargs):
        return treq.delete("{}/{}".format(self.url, document),
                           **self._update_kwargs(kwargs)
                           )

    def infoDB(self):
        return self.get('', params={"descr": 'infoDB'})


### BASED on https://github.com/iffy/paisley/blob/master/paisley/changes.py

class ChangeReceiver(basic.LineReceiver):
    # figured out by checking the last two characters on actually received
    # lines
    delimiter = '\n'

    def __init__(self, notifier):
        self._notifier = notifier

    def lineReceived(self, line):
        if not line:
            return

        change = json.loads(line)

        if not 'id' in change:
            return

        self._notifier.changed(change)

    def connectionLost(self, reason):
        self._notifier.connectionLost(reason)


class DocumentLoadingChangeReceiver(ChangeReceiver):

    def lineReceived(self, line):
        if not line:
            return

        change = json.loads(line)
        print(change)

        if not 'id' in change:
            return

        dfr = self._notifier._db.get(change['id'])
        dfr.addCallback(self._notifier.changed)


class ChangeNotifier(object):

    receiverKlass = ChangeReceiver

    def __init__(self, db, since=None):
        self._db = db

        self._caches = []
        self._listeners = []
        self._prot = None

        self._since = since

        self._running = False

    def addCache(self, cache):
        self._caches.append(cache)

    def addListener(self, listener):
        self._listeners.append(listener)

    def isRunning(self):
        return self._running

    def start(self, **kwargs):
        """
        Start listening and notifying of changes.
        Separated from __init__ so you can add caches and listeners.

        By default, I will start listening from the most recent change.
        """
        assert 'feed' not in kwargs, \
            "ChangeNotifier always listens continuously."

        d = defer.succeed(None)

        def setSince(info):
            self._since = info['update_seq']

        if self._since is None:
            d.addCallback(lambda _: self._db.infoDB())
            d.addCallback(setSince)

        def requestChanges():
            kwargs['feed'] = 'continuous'
            kwargs['since'] = self._since
            # FIXME: str should probably be unicode, as dbName can be
            return self._db.raw_get("/_changes?{}".format(urlencode(kwargs)))

        d.addCallback(lambda _: requestChanges())

        def requestCb(response):
            self._prot = self.receiverKlass(self)
            response.deliverBody(self._prot)
            self._running = True

        d.addCallback(requestCb)

        def returnCb(_):
            return self._since

        d.addCallback(returnCb)

        return d

    def stop(self):
        # FIXME: this should produce a clean stop, but it does not.
        # From http://twistedmatrix.com/documents/current/web/howto/client.html
        # "If it is decided that the rest of the response body is not desired,
        # stopProducing can be used to stop delivery permanently; after this,
        # the protocol's connectionLost method will be called."
        self._running = False
        self._prot.stopProducing()

    # called by receiver

    def changed(self, change):
        seq = change.get('seq', None)
        if seq:
            self._since = seq

        for cache in self._caches:
            cache.delete(change['id'])

        for listener in self._listeners:
            listener.changed(change)

    def connectionLost(self, reason):
        # even if we asked to stop, we still get
        # a twisted.web._newclient.ResponseFailed containing
        #   twisted.internet.error.ConnectionDone
        # and
        #   twisted.web.http._DataLoss
        # If we actually asked to stop, just pass through only ConnectionDone

        # FIXME: poking at internals to get failures ? Yuck!
        from twisted.web import _newclient
        if reason.check(_newclient.ResponseFailed):
            if reason.value.reasons[0].check(error.ConnectionDone) and \
                    not self.isRunning():
                reason = reason.value.reasons[0]

        self._prot = None
        self._running = False
        for listener in self._listeners:
            listener.connectionLost(reason)


__CHANGE_LISTENERS_POOL = {}


class DocumentLoadingChangeNotifier(ChangeNotifier):
    receiverKlass = DocumentLoadingChangeReceiver


def get_listener_from_pool(db, filter=None, **kwargs):
    key = (db.url, filter)
    try:
        return __CHANGE_LISTENERS_POOL[key]
    except KeyError:
        notifier = DocumentLoadingChangeNotifier(db)
        notifier.start(filter=filter, **kwargs)
        __CHANGE_LISTENERS_POOL[key] = notifier
        return notifier
