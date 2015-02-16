'use strict';

var strph = require("strophe"), // becomes "window.Strophe"
    // mam = require("strophe-plugins/mam"), // Message Archive Management Protocol
    roster = require("strophe-plugins/roster"), // Roster Management
    ping = require("strophe-plugins/ping"), // Ping-Pong Management
    actions = require("./actions"),
    moment = require("moment"),
    simple_register = require("./_helpers").simple_register,
    BOSH_SERVICE = 'ws://chat.thegeoffrey.co/ws-xmpp/',
    connection = null,
    // wrapping strophe ....
    Strophe = window.Strophe,
    $msg = window.$msg,
    $pres = window.$pres;

function log(){
  console.log && console.log(arguments);
}

function handlePing(ping){
  connection.ping.pong(ping);
  return true
}

function onMessage(msg) {
    log(msg);
    var type = msg.getAttribute('type');

    console.log(type);
    if (type == null) {
      // MAM: we are an archive
      var result = msg.childNodes[0],
          delay = result.getElementsByTagName("delay")[0],
          timestamp = delay.getAttribute("stamp"),
          from = delay.getAttribute("from"),
          message = msg.getElementsByTagName("message"),
          payload = {from: Strophe.getBareJidFromJid(from),
                     id: result.id, // our archive ID
                     timestamp: moment(timestamp)};

      if (!message.length) return;

      message = message[0];
      payload["to"] = Strophe.getBareJidFromJid(message.getAttribute("to"));
      payload["text"] = Strophe.getText(message.childNodes[0]);

      actions.receiveMessage(payload);

      console.log("archived message", payload);

    } else if (type == "chat") {
      var payload = {
            to: Strophe.getBareJidFromJid(msg.getAttribute('to')),
            from: Strophe.getBareJidFromJid(msg.getAttribute('from'))
          },
          body = msg.getElementsByTagName('body'),
          archive = msg.getElementsByTagName('archived');

      if (!body.length) return;

      payload['text'] = Strophe.getText(body[0]);
      payload["timestamp"] = moment();

      if (archive.length){
        // MAM: archive ID is given for us for later lookup
        payload['id'] = archive[0].id;
      }

      actions.receiveMessage(payload);

    } else if (type == "groupchat"){
      // FIXME: not yet support
    }

    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
}

function init(service, server, username, session_id){
    connection = new Strophe.Connection(service || BOSH_SERVICE);
    // connection.rawInput = rawInput;
    // connection.rawOutput = rawOutput;
    var password = null,
        jid = server || "chat.thegeoffrey.co";

    if (username){
        jid = username + "@" + jid;
        password = session_id
    }

    console.log(jid, username, password, session_id);

    connection.connect(jid, session_id,
        function onConnect(status, reason) {

        if (status == Strophe.Status.CONNECTING) {
           log('Strophe is connecting.');
           actions.connecting();

        } else if (status == Strophe.Status.AUTHENTICATING) {
           log('Strophe authenticating...', arguments);
           actions.authenticating();

        } else if (status == Strophe.Status.ATTACHED) {
           log('Strophe attached...', arguments);
           actions.attached({reason: reason});

        } else if (status == Strophe.Status.AUTHFAIL) {
           log('Strophe authenticating... failed', arguments);
           actions.authFailed({reason: reason});

        } else if (status == Strophe.Status.CONNFAIL) {
           log('Strophe failed to connect.', arguments);
           actions.connFailed({reason: reason});

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


function query_roster(connection){
    connection.roster.get(function(){
        console.log("roster received", arguments, connection.roster.items);
        actions.rosterChanged(connection.roster.items);
    });
}

function whoami(){
    return Strophe.getBareJidFromJid(connection.jid);
}

function isMe(compareJid){
  return whoami() === Strophe.getBareJidFromJid(compareJid);
}

function getConnection(){
  return connection;
}


simple_register({
  "connected": function(evt){
    connection.addHandler(onMessage, null, "message", null, null,  null);
    // set presence to there
    connection.send($pres().tree());
    // query the roster, will query the archive
    query_roster(connection);
    connection.ping.addPingHandler(handlePing);
  },
  "sendMessage": function(payload){
    var reply = $msg({to: payload.to.trim(), type: "chat"})
                    .cnode(Strophe.xmlElement('body', payload.text.trim()));
    connection.send(reply.tree());
  }
});

module.exports = {init: init,
                  isMe: isMe,
                  whoami: whoami,
                  getConnection: getConnection};
