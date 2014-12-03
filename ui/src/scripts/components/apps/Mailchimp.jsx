/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    SimpleAppMixin = require('./_mixin'),
    Router = require('react-router-component'),
    rtbs = require('react-bootstrap'),
    Input = rtbs.Input;

var Mailchimp = React.createClass({
  _key: 'mailchimp',
  _sync_keys: ['api_key', 'list_id'],
  _services: ['mailchimp_subscribe'],
  _name: "Mailchimp",
  mixins: [SimpleAppMixin],

  _render: function(){
    return(
        <form onSubmit={this._defaultFormSubmit} className='form-horizontal'>
         <Input type="text" label="Api Key:" defaultValue={this.state.api_key}  placeholder="add key here" ref="api_key" labelClassName="col-xs-1" wrapperClassName="col-xs-10"/>
         <Input type="text" label="List Id:" defaultValue={this.state.list_id}  placeholder="add list id here" ref="list_id" labelClassName="col-xs-1" wrapperClassName="col-xs-10" />
         <Input type="checkbox"
                   defaultChecked={this.state.mailchimp_subscribe}
                   ref="mailchimp_subscribe" 
                   wrapperClassName="col-xs-offset-1 col-xs-10"
                   label="Subscribe new Users to Mailchimp automatically"/>    
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
    );
  }
});

module.exports = Mailchimp;