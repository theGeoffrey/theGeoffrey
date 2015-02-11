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
    BG_COLOR = 'rgb(133, 0, 192)',
    COLOR = 'white',
    updateConfig = require('../../actions/Config').updateConfig,
    OAuth = window.OAuth;

var Chat = React.createClass({
  _color: COLOR,
  _bg_color: BG_COLOR,
  _key: 'chat',
  _sync_keys: [],
  _services: ['chat_main', 'chat_shoutbox'],
  _name: "Chat",
  mixins: [SimpleAppMixin],

  
  
  _render: function(){
    return(
        <form onSubmit={this._defaultFormSubmit} className='form-horizontal'>
         <Input type="checkbox"
                   defaultChecked={this.state.chat_main}
                   ref="chat_main" 
                   wrapperClassName="col-xs-offset-1 col-xs-10"
                   label="Activate chat"/> 
         <Input type="checkbox"
                   defaultChecked={this.state.chat_shoutbox}
                   ref="chat_shoutbox" 
                   wrapperClassName="col-xs-offset-1 col-xs-10"
                   label="Activate shoutbox"/> 
          <button className="btn btn-primary btn-form" type="submit">Save</button>
        </form>
    );
  }
});

module.exports = {
        name: 'Chat',
        letter: 'C',
        fa: 'comments-o',
        bg_color: BG_COLOR,
        color: COLOR,
        show_on_overview: keyChecker('chat'),
        can_add: keyChecker('chat', true),
        component: Chat
      };