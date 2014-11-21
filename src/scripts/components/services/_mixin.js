
var updateConfig = require('../../actions/appConfig').updateConfig,
    $ = require('jquery'),
    appConfig = require('../../stores/App');

module.exports = {
    componentDidMount: function() {
        appConfig.on('all', this._onChange);
    },
    getInitialState: function() {
        return this._get_config();
    },
    _get_config: function(inp){
        return $.extend(inp || {}, (appConfig.attributes || {})[this._key] || {});
    },
    _onChange: function(){
        this.setState(this._get_config());
    },
    _defaultFormSubmit: function(evt){
        updateConfig(this._key, this._get_form_data());
        return false;
    },
    _get_form_data: function(){
        var keys = this._sync_keys || "";
        if (keys.length === 0) {
            console.warn("No _sync_keys found on", this)
            return {};
        }

        var data = {},
            refs = this.refs;
        $.each(keys, function(idx, x){
            data[x] = refs[x].getDOMNode().value.trim();
        });
        return data;
    }
}