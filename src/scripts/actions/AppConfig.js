
var AppDispatcher = require('../dispatchers/App');

module.exports = {
    updateConfig: function(key, content) {
        return AppDispatcher.dispatch({
            actionType: 'updateConfig',
            key: key,
            content: content
        });
    }
}