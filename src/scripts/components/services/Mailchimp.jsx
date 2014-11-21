/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    SimpleServiceMixin = require('./_mixin');
    Router = require('react-router-component');

var Mailchimp = React.createClass({
  _key: 'mailchimp',
  _sync_keys: ['api_key'],
  mixins: [SimpleServiceMixin],
  render: function(){
    return(
      <div className="mailchimp">
        <h2>Mailchimp Configuration</h2>
        <form onSubmit={this._defaultFormSubmit}>
          <dl>
            <dt>Mailchimp API Key</dt>
            <dd>
              <input type="text" value={this.state.api_key}  placeholder="add key here" ref="api_key" />
            </dd>
          </dl>
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
      </div>
    );
  }
});

module.exports = Mailchimp;