var Model = require('backbone-model').Model,
    AppDispatcher = require('../dispatchers/App'),
    AppConfigModel = Model.extend({
        // let's be a dummy
        sync: function(method, model, options){
            switch(method){
                case 'read':
                    options.success({
                        'id': 1,
                        'api_key': 'C5A24A08-7148-11E4-B99B-375BBC5C6E8B',
                        'public_key': 'CC229630-7148-11E4-9485-375BBC5C6E8B',
                        'dc_url': 'http://example.geoffrey.xyz'
                    })
                    break
                case 'create':
                case 'patch':
                    // alert(model);
                    options.success(model.attributes);
                    break;
                default:
                    // alert(method);
            }

        }
    });

var appConfig = new AppConfigModel({});

AppDispatcher.register(function(payload) {
    switch(payload.actionType){
        case 'updateConfig':
            var update = {};
                update[payload.key] = payload.content
            return appConfig.save(update, {patch: true});
        case 'initApp':
            return appConfig.fetch()
        default:
            break;
    }
    return true;
});

module.exports = appConfig;