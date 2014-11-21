var Model = require('backbone-model').Model,
    AppDispatcher = require('../dispatchers/App'),
    site = new Model({'title': 'Geoffrey UI'});

AppDispatcher.register(function(payload) {
    if (payload.actionType == 'set-title') {
        site.set('title', payload.title);
    }
    return true;
});

module.exports = site;