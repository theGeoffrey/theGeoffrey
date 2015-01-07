/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    SimpleAppMixin = require('./_mixin'),
    Router = require('react-router-component'),
    keyChecker = require("../_helpers").keyChecker,
    rtbs = require('react-bootstrap'),
    Input = rtbs.Input,
    BG_COLOR = 'rgb(133, 98, 192)',
    COLOR = 'white',
    OAuth = window.OAuth;

var Twitter = React.createClass({
  _color: COLOR,
  _bg_color: BG_COLOR,
  _key: 'twitter',
  _sync_keys: ['api_key', 'tweet_txt', 'tweet_topic'],
  _services: ['tweet_topic', 'post_tweet'],
  _name: "Twitter",
  mixins: [SimpleAppMixin],

  signinTwitter: function () {
    OAuth.popup('twitter', {cache: true}).done(function(twitter) {
      console.log(twitter);
      
    }).fail(function(err) {
      throw('No luck signing you in!')
    })
  },
  
  
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

module.exports = {
        name: 'Twitter',
        letter: 'T',
        fa: 'twitter',
        bg_color: BG_COLOR,
        color: COLOR,
        show_on_overview: keyChecker('twitter'),
        can_add: keyChecker('twitter', true),
        component: Twitter
      };