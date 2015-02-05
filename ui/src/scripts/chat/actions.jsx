
var ChatDispatcher = require('./dispatcher');

module.exports = {
    // messages
    sendMessage: function(payload) {
        return MainDispatcher.dispatch({
            actionType: 'sendMessage',
            payload: payload
        });
    },
    receiveMessage: function(payload) {
        return MainDispatcher.dispatch({
            actionType: 'receiveMessage',
            payload: payload
        });
    },
    // connectivity

    connecting: function(payload) {
        return MainDispatcher.dispatch({
            actionType: 'connecting',
            payload: payload
        });
    },

    connFailed: function(payload) {
        return MainDispatcher.dispatch({
            actionType: 'connFailed',
            payload: payload
        });
    },

    disconnecting: function(payload) {
        return MainDispatcher.dispatch({
            actionType: 'disconnecting',
            payload: payload
        });
    },
    disconnected: function(payload) {
        return MainDispatcher.dispatch({
            actionType: 'disconnected',
            payload: payload
        });
    },

    connected: function(payload) {
        return MainDispatcher.dispatch({
            actionType: 'connected',
            payload: payload
        });
    },
}