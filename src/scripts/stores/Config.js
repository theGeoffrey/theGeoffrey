var Model = require('backbone-model').Model,
    sync = require('./_db').sync;
    BackbonePouch = require('backbone-pouch'),
    MainDispatcher = require('../dispatchers/Main'),
    ConfigModel = Model.extend({sync: sync});

var config = new ConfigModel({_id: "CONFIG"});

MainDispatcher.register(function(evt) {
    switch(evt.actionType){
        case 'updateConfig':
            return config.save(evt.payload,
                {patch: true});
        case 'initMain':
            return config.fetch();
        default:
            break;
    }
    return true;
});

module.exports = config;