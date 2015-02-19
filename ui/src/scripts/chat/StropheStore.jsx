'use strict';

var strph = require("strophe"), // becomes "window.Strophe"
    muc = require("strophe-plugins/muc"), // Install Multi-User-Chat
    roster = require("strophe-plugins/roster"), // Roster Management
    ping = require("strophe-plugins/ping"), // Ping-Pong Management
    actions = require("./actions"),
    moment = require("moment"),
    { simple_register, isMe } =  require("./_helpers"),
    BOSH_SERVICE = 'ws://chat.thegeoffrey.co/ws-xmpp/',
    Backbone = require('backbone'),
    connection = null,
    // wrapping strophe ....
    Strophe = window.Strophe,
    $msg = window.$msg,
    $pres = window.$pres;


if(DEBUG){
  Strophe.log = function (level, msg) {
    if (level == Strophe.LogLevel.ERROR || level ==Strophe.LogLevel.FATAl){
        console.error("STROPHE ERROR:", msg);
    } else {
      console.log("STROPHE", msg);
    }
  }
}

function handlePing(ping){
  connection.ping.pong(ping);
  return true;
}

function getConnection(){
  return connection;
}

function _parse_message(msg, frm){

  var type = msg.getAttribute('type'),
      body = msg.getElementsByTagName('body'),
      thread = msg.getElementsByTagName('thread'),
      archive = msg.getElementsByTagName('archived'),
      from = frm || msg.getAttribute('from'),
      payload = {
        to: Strophe.getBareJidFromJid(msg.getAttribute('to')),
        from: Strophe.getBareJidFromJid(from),
        isGroupChat: false
      };

  if (!body.length) return;

  payload['text'] = Strophe.getText(body[0]);
  payload["timestamp"] = moment();

  payload["conversationId"] = isMe(payload.from) ? payload.to : payload.from

  if (thread.length){
    payload["threadId"] = Strophe.getText(thread[0]);
  }

  if (type === "groupchat"){
    payload["conversationId"] = payload["from"];
    payload["from"] = Strophe.getResourceFromJid(from);
    payload["isGroupChat"] = true;
  }

  if (archive.length){
    // MAM: archive ID is given for us for later lookup
    payload['id'] = archive[0].id;
  }

  return payload;
}

function onPresence(presence) {
  var jid = presence.getAttribute('from'),
      type = presence.getAttribute('type'),
      show = (presence.getElementsByTagName('show').length !== 0) ? Strophe.getText(presence.getElementsByTagName('show')[0]) : null,
      status =  (presence.getElementsByTagName('status').length !== 0) ? Strophe.getText(presence.getElementsByTagName('status')[0]) : null,
      priority = (presence.getElementsByTagName('priority').length !== 0) ? Strophe.getText(presence.getElementsByTagName('priority')[0]) : null,
      last = $('query[xmlns="jabber:iq:last"]', presence).length !==0 ? $('query[xmlns="jabber:iq:last"]', presence).attr('seconds') :  null;
}

function onMessage(msg) {
    DEBUG && console.log("message", msg);
    var type = msg.getAttribute('type');

    DEBUG && console.log("type is", type, msg);
    if (type == null) {
      // MAM: we are an archive
      var result = msg.childNodes[0],
          delay = result.getElementsByTagName("delay")[0],
          timestamp = delay.getAttribute("stamp"),
          from = delay.getAttribute("from"),
          message = msg.getElementsByTagName("message"),
          payload = message.length ? _parse_message(message[0], from) : null;

      if (!payload) return console.log("nope", message, payload);

      payload.id = result.id;
      payload.timestamp = moment(timestamp);

      actions.receiveMessage(payload);

      DEBUG && console.log("archived message", payload);

    } else {
      actions.receiveMessage(_parse_message(message));
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

    DEBUG && console.log(jid, username, password, session_id);

    connection.connect(jid, session_id,
        function onConnect(status, reason) {

        if (status == Strophe.Status.CONNECTING) {
           DEBUG && console.log('Strophe is connecting.');
           actions.connecting();

        } else if (status == Strophe.Status.AUTHENTICATING) {
           DEBUG && console.log('Strophe authenticating...', arguments);
           actions.authenticating();

        } else if (status == Strophe.Status.ATTACHED) {
           DEBUG && console.log('Strophe attached...', arguments);
           actions.attached({reason: reason});

        } else if (status == Strophe.Status.AUTHFAIL) {
           DEBUG && console.log('Strophe authenticating... failed', arguments);
           actions.authFailed({reason: reason});

        } else if (status == Strophe.Status.CONNFAIL) {
           DEBUG && console.log('Strophe failed to connect.', arguments);
           actions.connFailed({reason: reason});

        } else if (status == Strophe.Status.DISCONNECTING) {
           DEBUG && console.log('Strophe is disconnecting.');
           actions.disconnecting();

        } else if (status == Strophe.Status.DISCONNECTED) {
           DEBUG && console.log('Strophe is disconnected.');
           actions.disconnected();

        } else if (status == Strophe.Status.CONNECTED) {
           DEBUG && console.log('Strophe is connected.');
           actions.connected({jid: connection.jid});
           window.STROPHE_CONNECTION = connection;
        }
    });
};

function query_roster(connection){
    connection.roster.get(function(){
        DEBUG && console.log("roster received", arguments, connection.roster.items);
        actions.rosterChanged(connection.roster.items);
    });
}

simple_register({
  "connected": function(evt){
    connection.addHandler(onMessage, null, "message", null, null,  null);
    connection.addHandler(onPresence, null, "presence", null, null,  null);
    // set presence to there
    connection.send($pres().tree());
    // query the roster, will query the archive
    query_roster(connection);
    connection.ping.addPingHandler(handlePing);
  },
  "sendMessage": function(payload){
    var conversation = require("./ConversationStore").get(payload.to);
    var type = conversation && conversation.get("isGroupChat") ? "groupchat" : "chat";
    var reply = $msg({to: payload.to.trim(), type: type})
                    .cnode(Strophe.xmlElement('body', payload.text.trim()));
    connection.send(reply.tree());
  }
});

module.exports = {init: init,
                  getConnection: getConnection};
