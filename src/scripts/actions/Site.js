
var AppDispatcher = require('../dispatchers/App');

module.exports = {
    setTitle: function(title) {
        AppDispatcher.dispatch({
            actionType: 'set-title',
            title: title
        });
    },
    setLogo: function(logo){
        AppDispatcher.dispatch({
            actionType: 'set-logo',
            title: title
        });
    }
}