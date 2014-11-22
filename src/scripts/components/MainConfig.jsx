/** @jsx React.DOM */

'use strict';

var React = require('react/addons'),
    ReactBackboneMixin = require('backbone-react-component'),
    Config = require('../stores/Config');


module.exports = React.createClass({
    componentDidMount: function() {
        Config.on('all sync', this._onChange);
    },
    getInitialState: function() {
        return Config.attributes;
    },
    _onChange: function(){
        this.setState(Config.attributes);
    },
    render: function () {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">Base Configuration</div>
          <div className="panel-body">
            <dl id='app-config'>
                <dt>APP Key</dt>
                <dd>{this.state.api_key}</dd>
                <dt>Public Key</dt>
                <dd>{this.state.public_key}</dd>
                <dt>Discourse URL</dt>
                <dd>{this.state.dc_url}</dd>
                <dt>Active Services</dt>
                <dd>{this.state.services}</dd>
              </dl>
            </div>
        </div>
        );
    }
});