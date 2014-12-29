
from twisted.internet.protocol import Factory, Protocol
from txsockjs.factory import SockJSResource

from geoffrey.couchdb_connection import get_listener_from_pool
from geoffrey.utils import get_params, db_now

import json


class ChatProtocol(Protocol):

    def changed(self, document):
        # receiving database changes
        print('got a change: {}'.format(document))
        if document['from'] == self.session['user'] or \
                document['to'] == self.session['user']:
            self.transport.write(document)

    def connectionMade(self):
        if not hasattr(self, "changeListener"):
            self.changeListener = get_listener_from_pool(self.db_client,
                    filter="chat/all_messages")
            self.changeListener.addListener(self)
        print("MADE IT: {}".format(self.session))
        # look up current state:

    def dataReceived(self, data):
        try:
            payload = json.loads(data)
        except:
            # FIXME: log this
            return

        print(payload)

        if not 'type' in payload:
            return

        if payload['type'] == "chat":
            to, msg = get_params(payload, 'to', 'message')
            message = {'type': 'chat',
                       'to': to,
                       'from': self.session['user'],
                       'message': msg,
                       'when': db_now()}
            print("alright, posting message: {}".format(msg))
            self.db_client.post(data=json.dumps(message))


def receiver(request):
    class _ChatProtocol(ChatProtocol):
        db_client = request.db_client
        session = request.session
        config = request.config

    return SockJSResource(Factory.forProtocol(_ChatProtocol))
