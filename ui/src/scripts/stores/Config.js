var Model = require('backbone-model').Model,
    sync = require('./_db').sync;
    BackbonePouch = require('backbone-pouch'),
    MainDispatcher = require('../dispatchers/Main'),
    ConfigModel = Model.extend({sync: sync}),
    config = new ConfigModel({_id: "CONFIG"});

MainDispatcher.register(function(evt) {
    switch(evt.actionType){
        case 'updateConfig':
            return config.save(evt.payload,
                {patch: true});
        case 'initMain':
            return config.fetch();
        case 'fakeConfig':
            config.set({
                    'api_key': 'C5A24A08-7148-11E4-B99B-375BBC5C6E8B',
                    'public_key': 'CC229630-7148-11E4-9485-375BBC5C6E8B',
                    'dc_url': 'http://example.geoffrey.xyz',
                    'dc_username': 'system',
                    'dc_api_key' : 'JSDBKBVU809789629HJKN8789-BJK',

                    'mailchimp': {
                        'api_key': 'TE ST',
                        'list_id': '12345'
                    },
                    'forms': [{
                            'form_type': 'Feedback',
                            'form_key': 'JBUCSBAUB9809',
                            'category': 'general',
                            'template': 'this is going to be a lot more text lllalalalalallala lalala',
                            'title': 'title',
                            'post_message': 'message'
                        },{
                            'form_type': 'Contact',
                            'form_key': 'LJAdkfjlasd',
                            'category': 'general',
                            'template': 'this is going to be a lot more text lllalalalalallala lalala',
                            'title': 'Top',
                            'post_message': 'MXS'
                        }
                    ]
                })
            config.trigger('sync')
            break;
        default:
            break;
    }
    return true;
});

module.exports = config;