/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    SimpleAppMixin = require('./_mixin');
    Router = require('react-router-component');

var Mailchimp = React.createClass({
  _key: 'mailchimp',
  _sync_keys: ['api_key'],
  _services: ['mailchimp_subscribe'],
  _name: "Mailchimp",
  mixins: [SimpleAppMixin],
  _render: function(){
    return(
        <form onSubmit={this._defaultFormSubmit}>
          <dl>
            <dt>Mailchimp API Key</dt>
            <dd>
              <input type="text" value={this.state.api_key}  placeholder="add key here" ref="api_key" />
            </dd>
              <dl>
                <dt>
                  <label>
                    <input type="checkbox"
                           defaultChecked={this.state.mailchimp_subscribe}
                           ref="mailchimp_subscribe" />
                    Subscribe new Users to Mailchimp automatically
                  </label>
                </dt>
              </dl>
          </dl>
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
    );
  }
});

module.exports = Mailchimp;