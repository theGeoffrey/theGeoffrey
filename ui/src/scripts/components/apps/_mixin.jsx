/**
 * @jsx React.DOM
 */

var updateConfig = require('../../actions/Config').updateConfig,
    _ = require('underscore'),
    React = require('react'),
    Link = require('react-router-component').Link
    CONFIG = require('../../stores/Config');

module.exports = {
    componentDidMount: function() {
        CONFIG.on('all', this._onChange);
    },
    getInitialState: function() {
        return this._get_config();
    },
    _get_config: function(inp){
        var cfg = _.extend(inp || {}, CONFIG.attributes[this._key]);
        if (this._services && this._services.length){
            var active_services = CONFIG.attributes['services'] || [];
            _.each(this._services, function(service){
                cfg[service] = _.contains(active_services, service);
            });
        }
        return cfg
    },
    _onChange: function(){
        if (this.isMounted()) {
            this.setState(this._get_config())
        };
    },
    _defaultFormSubmit: function(evt){
        var payload = {},
            active_services = (CONFIG.attributes || {})['services'] || [];
            my_services = this._get_service_definition();

        // load in defaults
        payload[this._key] = this._get_form_data();

        if (my_services){
            payload['services'] = _.union(
                _.reject(active_services, function(s){
                    return _.contains(my_services[1], s);
                }), my_services[0]);
        }

        updateConfig(payload);
        return false;
    },
    _get_form_data: function(){
        debugger;
        var keys = this._sync_keys || "",
            refs = this.refs;
        if (keys.length === 0) {
            return {};
        }

        return _.object(_.map(keys, function(k){
                return [k, refs[k].getValue().trim()]
            }));
    },
    _get_service_definition: function(){
        var services = this._services || "";
        if (services.length === 0) {
            return;
        }

        var add = [],
            remove = [],
            refs = this.refs;
        _.each(services, function(service){
            if (refs[service].getDOMNode().checked){
                add.push(service);
            } else {
                remove.push(service);
            }
        });
        return [add, remove];
    },
    render: function(){
        var component = this._render();
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        <Link href="/">Apps</Link> <i className="fa fa-angle-double-right"></i> {this._name}
                    </h3>
                </div>
                <div className="panel-body">
                    {component}
                </div>
            </div>)
    }
}