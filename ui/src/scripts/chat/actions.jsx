
var ChatDispatcher = require('./dispatcher');

module.exports = {
    // messages
    sendMessage: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'sendMessage',
            payload: payload
        });
    },
    receiveMessage: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'receiveMessage',
            payload: payload
        });
    },

    // roster stuff
    rosterChanged: function(roster){
        return ChatDispatcher.dispatch({
            actionType: 'connecting',
            payload: {items: roster}
        });
    },
    // connectivity

    connecting: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'connecting',
            payload: payload
        });
    },

    authenticating: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'authenticating',
            payload: payload
        });
    },

    authFailed: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'authFailed',
            payload: payload
        });
    },

    connFailed: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'connFailed',
            payload: payload
        });
    },

    attached: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'attached',
            payload: payload
        });
    },

    disconnecting: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'disconnecting',
            payload: payload
        });
    },
    disconnected: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'disconnected',
            payload: payload
        });
    },

    connected: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'connected',
            payload: payload
        });
    },
}