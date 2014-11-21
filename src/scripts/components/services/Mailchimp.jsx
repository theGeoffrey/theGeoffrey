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
  _services: ['subscribe_to_mailchimp'],
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
              <dl>
                <dt><label><input type="checkbox" defaultChecked={this.state.subscribe_to_mailchimp} ref="subscribe_to_mailchimp" /> Subscribe new Users to Mailchimp automatically</label></dt>
              </dl>
          </dl>
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
      </div>
    );
  }
});

module.exports = Mailchimp;