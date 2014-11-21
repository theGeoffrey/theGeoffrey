
var AppDispatcher = require('../dispatchers/App');

module.exports = {
    updateConfig: function(payload) {
        return AppDispatcher.dispatch({
            actionType: 'updateConfig',
            payload: payload
        });
    }
}