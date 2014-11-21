
var updateConfig = require('../../actions/appConfig').updateConfig,
    $ = require('jquery'),
    appConfig = require('../../stores/App');

module.exports = {
    componentDidMount: function() {
        appConfig.on('all', this._onChange);
    },
    getInitialState: function() {
        return (appConfig.properties || {})[this._key] || {};
    },
    _onChange: function(){
        this.setState((appConfig.properties || {})[this._key] || {});
    },
    _defaultFormSubmit: function(evt){
        updateConfig(this._key, this._get_form_data());
        return false;
    },
    _get_form_data: function(){
        var keys = this._sync_keys || [];
        if (keys.length === 0) return {};

        var data = {};
        $.each(keys, function(x){
            data[x] = this.refs[x].getDOMNode().value.trim();
        });
        return data;
    }
}