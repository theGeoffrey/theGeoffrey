/** @jsx React.DOM */

'use strict';

var React = require('react/addons'),
    ReactBackboneMixin = require('backbone-react-component'),
    _helpers = require('./_helpers'),
    Config = require('../stores/Config');


module.exports = React.createClass({
    mixins: [_helpers.configRerenderMixin],
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