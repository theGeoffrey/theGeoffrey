/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    SimpleAppMixin = require('./_mixin');
    Router = require('react-router-component');

var Mailchimp = React.createClass({
  _key: 'mailchimp',
  _sync_keys: ['api_key', 'list_id'],
  _services: ['mailchimp_subscribe'],
  _name: "Mailchimp",
  mixins: [SimpleAppMixin],
  _render: function(){
    return(
        <form onSubmit={this._defaultFormSubmit}>
          <div className="form-group">
             <label for="mcApiKey">Mailchimp API Key</label>
             <input type="text" className="form-control" id="mcApiKey" value={this.state.api_key}  placeholder="add key here" ref="api_key" />
          </div>
          <div className="form-group">
             <label for="mcListId">Mailchimp List ID</label>
             <input type="text" className="form-control" id="mcListId" value={this.state.list_id}  placeholder="add list id here" ref="list_id" />
          </div>
          <div className="checkbox">
          <label>
            <input type="checkbox"
                   defaultChecked={this.state.mailchimp_subscribe}
                   ref="mailchimp_subscribe" />
                   Subscribe new Users to Mailchimp automatically
          </label>
          </div>    
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
    );
  }
});

module.exports = Mailchimp;