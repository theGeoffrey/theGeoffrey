'use strict';

var strph = require("strophe"), // becomes "window.Strophe"
    mam = require("strophe-plugins/mam"), // Message Archive Management Protocol
    roster = require("strophe-plugins/roster"), // Roster Management
    muc = require("strophe-plugins/muc"), // Multi User Chat
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
    connection = new Strophe.Connection(service || BOSH_SERVICE);
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

function query_archive_for_user(connection, target){
    connection.mam.query(connection.jid, {
      "with": target,
      onMessage: function(message) {
        console.log(message);
        actions.receiveMessage(message);
        return true;
      },
      onComplete: function(response) {
                console.log("Got all the messages with " + target);
      }
    });
}

function query_roster(connection){
    connection.roster.get(function(){
        console.log(arguments, connection.roster.items);
        actions.rosterChanged(connection.roster.items);
    });
}

dispatcher.register(function(evt) {
    switch(evt.actionType){
        case 'connected':
            connection.addHandler(onMessage, null, 'message', null, null,  null);
            // set presence to there
            connection.send($pres().tree());
            // query the roster, will query the archive
            query_roster(connection);

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