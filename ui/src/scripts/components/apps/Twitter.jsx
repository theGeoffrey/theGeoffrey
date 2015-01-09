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
    updateConfig = require('../../actions/Config').updateConfig,
    OAuth = window.OAuth;

var Twitter = React.createClass({
  _color: COLOR,
  _bg_color: BG_COLOR,
  _key: 'twitter',
  _sync_keys: ['tweet_txt', 'tweet_topic', 'tweet_title'],
  _services: ['tweet_topic', 'post_tweet'],
  _name: "Twitter",
  mixins: [SimpleAppMixin],

  signinTwitter: function (e) {
    e.preventDefault();
    OAuth.popup('twitter', {cache: true}).done(function(twitter) {
      console.log(twitter['oauth_token']);

      updateConfig({"twitter" : {"ckey" : twitter['oauth_token'],
                                "csecret" : twitter['oauth_token_secret'],
                                "tweet_txt": this.state.tweet_txt,
                                "tweet_topic": this.state.tweet_topic}});
      
    }).fail(function(err) {
      throw('No luck signing you in!')
    })
    return false;
  },
  
  
  _render: function(){
    return(
        <form onSubmit={this._defaultFormSubmit} className='form-horizontal'>
         <Input type="checkbox"
                   defaultChecked={this.state.tweet_title}
                   ref="tweet_title" 
                   wrapperClassName="col-xs-offset-1 col-xs-10"
                   label="Include topic title in tweet"/> 
         <Input type='textarea' label="Custom tweet message:" labelClassName="col-xs-2" 
                      wrapperClassName="col-xs-10" defaultValue={this.state.tweet_txt}  
                      placeholder="message" ref="tweet_txt" /> 
         <Input type="checkbox"
                   defaultChecked={this.state.tweet_topic}
                   ref="tweet_topic" 
                   wrapperClassName="col-xs-offset-1 col-xs-10"
                   label="Automatically tweet new topics"/> 
          <button className="btn btn-primary btn-form" type="submit">Save</button>
           <button className="btn btn-primary btn-form" onClick={this.signinTwitter}>Authenticate</button>
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