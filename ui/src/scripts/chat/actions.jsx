
var ChatDispatcher = require('./dispatcher'),
    _ = require("underscore"),
    actions = {};

_.each([
    // messages
    "sendMessage", "receiveMessage",

    // conversations
    "startConversation",

    // roster
    "rosterChanged",

    // connectivity
    "connecting", "authenticating", "authFailed", "connFailed",
    "attached", "disconnecting", "disconnected", "connected",

    // rooms
    "createRoom", "failureToCreateRoom", "roomCreated", "deleteRoom"
    ],
    function(name){
    actions[name] = function(payload){
        return ChatDispatcher.dispatch({
            actionType: name,
            payload: payload
        });
    }
});

module.exports = actions;
