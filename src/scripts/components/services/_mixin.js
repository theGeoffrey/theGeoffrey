
var updateConfig = require('../../actions/appConfig').updateConfig,
    _ = require('underscore'),
    appConfig = require('../../stores/App');

module.exports = {
    componentDidMount: function() {
        appConfig.on('all', this._onChange);
    },
    getInitialState: function() {
        return this._get_config();
    },
    _get_config: function(inp){
        var cfg = _.extend(inp || {}, appConfig.attributes[this._key]);
        if (this._services && this._services.length){
            var active_services = appConfig.attributes['services'] || [];
            _.each(this._services, function(service){
                cfg[service] = _.contains(active_services, service);
            });
        }
        return cfg
    },
    _onChange: function(){
        this.setState(this._get_config());
    },
    _defaultFormSubmit: function(evt){
        var payload = {},
            active_services = (appConfig.attributes || {})['services'] || [];
            my_services = this._get_service_definition();

        // load in defaults
        payload[this._key] = this._get_form_data();
        console.log(my_services);
        if (my_services){
            payload['services'] = _.union(
                _.reject(active_services, function(s){
                    return _.contains(my_services[1], s);
                }), my_services[0]);
        }
        console.log(payload);
        updateConfig(payload);
        return false;
    },
    _get_form_data: function(){
        var keys = this._sync_keys || "",
            refs = this.refs;
        if (keys.length === 0) {
            return {};
        }

        return _.object(_.map(keys, function(k){
                return [k, refs[k].getDOMNode().value.trim()]
            }));
    },
    _get_service_definition: function(){
        var services = this._services || "";
        if (services.length === 0) {
            return;
        }

        var add = [],
            remove = []
            refs = this.refs;
        _.each(services, function(service){
            console.log(refs[service].getDOMNode().value);
            if (refs[service].getDOMNode().value === "on"){
                add.push(service);
            } else {
                remove.push(service);
            }
        });
        return [add, remove];
    }
}