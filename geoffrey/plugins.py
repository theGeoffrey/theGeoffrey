
from twisted.internet import defer


class PluginsManager(object):

    def __init__(self):
        self.callbacks = {}

    def register_callback(self, name, callback):
        self.callbacks.setdefault(name, []).append(callback)

    def execute_callback(self, name, *args, **kwargs):
        if not name in self.callbacks:
            return defer.succeed([])

        return defer.DeferredList(map(
                    lambda c: defer.maybeDeferred(c, *args, **kwargs),
                    self.callbacks[name]), consumeErrors=True)

    def run(self, *args, **kwargs):
        return self.execute_callback(*args, **kwargs)

manager = PluginsManager()
