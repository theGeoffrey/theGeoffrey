
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
    // connectivity

    connecting: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'connecting',
            payload: payload
        });
    },

    connFailed: function(payload) {
        return ChatDispatcher.dispatch({
            actionType: 'connFailed',
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