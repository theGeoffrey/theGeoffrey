
var _ = require('underscore');


var index = {
    mailchimp: require('./Mailchimp'),
    forms: require('./Forms'),
    twitter: require('./Twitter'),
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