
var _ = require('underscore');


function key_checker(key, inverse){
    return function(config){
        var contains = _.contains(config, key);
        if (inverse) { contains =! contains};
        return contains
    }
}



var index = {
    mailchimp: {
        name: 'MailChimp',
        letter: 'M',
        bg_color: '#2C9AB7',
        color: 'white',
        show_on_overview: key_checker('mailchimp'),
        can_add: key_checker('mailchimp', true),
        component: require('./Mailchimp'),
    }
}





function find_apps(func_name){
    return function(config){
        return _.filter(_.pairs(index), function(app){
            return app[1][func_name](config);
        });

    }
}

module.exports = {
    get_active_apps: find_apps('show_on_overview'),
    get_apps_to_add: find_apps('can_add'),
    get_app: function(key){
        return index[key];
    }
}