
var MainDispatcher = require('../dispatchers/Main');

module.exports = {
    updateConfig: function(payload) {
        return MainDispatcher.dispatch({
            actionType: 'updateConfig',
            payload: payload
        });
    }
}