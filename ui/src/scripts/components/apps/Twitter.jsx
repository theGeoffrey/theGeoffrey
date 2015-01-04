/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    SimpleAppMixin = require('./_mixin'),
    Router = require('react-router-component'),
    rtbs = require('react-bootstrap'),
    Input = rtbs.Input,
    OAuth = window.OAuth;

var Twitter = React.createClass({
  _key: 'twitter',
  _sync_keys: ['api_key', 'tweet_txt', 'tweet_topic'],
  _services: ['tweet_topic', 'post_tweet'],
  _name: "Twitter",
  mixins: [SimpleAppMixin],

  signinTwitter: function () {
    OAuth.popup('twitter', {cache: true}).done(function(twitter) {
      console.log(twitter);
      getTwitterToken();
    }).fail(function(err) {
      throw('No luck signing you in!')
    })
  },
  
  // getTwitterToken: function (){
  //   oauthResult.get(url).done(function(data) {
  //     console.log(data);
  //   }).fail(function(err) {
  //     throw('No luck getting token!')
  //   });
  // },

  _render: function(){
    return(
        <form onSubmit={this._defaultFormSubmit} className='form-horizontal'>
         <Input type="text" label="Api Key:" defaultValue={this.state.api_key}  placeholder="add key here" ref="api_key" labelClassName="col-xs-1" wrapperClassName="col-xs-10"/>
         <Input type='textarea' label="Custom tweet message:" labelClassName="col-xs-2" 
                      wrapperClassName="col-xs-10" defaultValue={this.state.tweet_txt}  
                      placeholder="Message that will be send to user once form has been posted" ref="tweet_txt" /> 
         <Input type="checkbox"
                   defaultChecked={this.state.mailchimp_subscribe}
                   ref="tweet_topic" 
                   wrapperClassName="col-xs-2 col-xs-10"
                   label="Automatically tweet new topics"/> 
          <button className="btn btn-primary btn-form" onClick={this.signinTwitter}>Authenticate</button>
          <button className="btn btn-primary btn-form" type="submit">Save</button>
        </form>
    );
  }
});

module.exports = Twitter;