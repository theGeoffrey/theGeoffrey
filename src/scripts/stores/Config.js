var Model = require('backbone-model').Model,
    MainDispatcher = require('../dispatchers/Main'),
    ConfigModel = Model.extend({
        // let's be a dummy
        sync: function(method, model, options){
            switch(method){
                case 'read':
                    options.success({
                        'id': 1,
                        'api_key': 'C5A24A08-7148-11E4-B99B-375BBC5C6E8B',
                        'public_key': 'CC229630-7148-11E4-9485-375BBC5C6E8B',
                        'dc_url': 'http://example.geoffrey.xyz',
                    })
                    break
                case 'create':
                case 'patch':
                    console.log(model.attributes);
                    setTimeout(options.success, 1);
                    break;
                default:
                    // alert(method);
            }

        }
    });

var config = new ConfigModel({});

MainDispatcher.register(function(evt) {
    switch(evt.actionType){
        case 'updateConfig':
            return config.save(evt.payload,
                {patch: true});
        case 'initMain':
            return config.fetch()
        default:
            break;
    }
    return true;
});

module.exports = config;