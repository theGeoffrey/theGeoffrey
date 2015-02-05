'use strict';

var strph = require("strophe"),
    actions = require("./actions"),
    dispatcher = require("./dispatcher"),
    BOSH_SERVICE = 'http://chat.thegeoffrey.co/http-bind/',
    connection = null,
    // wrapping strophe ....
    Strophe = window.Strophe,
    $msg = window.$msg,
    $pres = window.$pres;

function log(){
  console.log && console.log(arguments);
}

function onMessage(msg) {
    log(msg);
    var payload = {
            to: msg.getAttribute('to'),
            from: msg.getAttribute('from')
        },
        type = msg.getAttribute('type'),
        elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
        var body = elems[0];
        payload['text'] = Strophe.getText(body);
    }

    actions.receiveMessage(payload);

    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
}

function init(service, server){
    console.log("GO GO GO");
    connection = new Strophe.Connection(service || BOSH_SERVICE);
    console.log("GO GO GO");
    // connection.rawInput = rawInput;
    // connection.rawOutput = rawOutput;
    connection.connect(server || "chat.thegeoffrey.co", null, function onConnect(status, reason) {

        if (status == Strophe.Status.CONNECTING) {
           log('Strophe is connecting.');
           actions.connecting();

        } else if (status == Strophe.Status.CONNFAIL) {
           log('Strophe failed to connect.');
           actions.connFailed();

        } else if (status == Strophe.Status.DISCONNECTING) {
           log('Strophe is disconnecting.');
           actions.disconnecting();

        } else if (status == Strophe.Status.DISCONNECTED) {
           log('Strophe is disconnected.');
           actions.disconnected();

        } else if (status == Strophe.Status.CONNECTED) {
           log('Strophe is connected.');
           actions.connected({jid: connection.jid});
        }
    });
};

dispatcher.register(function(evt) {
    switch(evt.actionType){
        case 'connected':
            connection.addHandler(onMessage, null, 'message', null, null,  null);
            connection.send($pres().tree());
        break;
        case 'sendMessage':
            var payload = evt.payload,
                reply = $msg({to: payload.to.trim(), type: 'chat'})
                            .cnode(Strophe.xmlElement('body', evt.payload.text.trim()));
            connection.send(reply.tree());
        break;
    }
});

module.exports = init;