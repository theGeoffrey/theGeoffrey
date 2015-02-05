/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    initConnection = require('./chat/StropheStore'),
    dispatcher = require('./chat/dispatcher'),
    queryString = require('query-string'),
    rtbs = require('react-bootstrap'),
    Button = rtbs.Button,
    Input = rtbs.Input,
    Link = require('react-router-component').Link;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../styles/chat.less');

var ChatApp = React.createClass({

  componentWillMount: function() {
    dispatcher.register(function(evt){
      console.log(evt);
      if (evt.actionType == 'connected'){
        this.setState({loading: false, jid: evt.payload.jid})
      }
    }.bind(this));
  },
  componentDidMount: function(){
    initConnection();
  },

  getEndpoint: function(){
    return 'http://chat.thegeoffrey.co/http-bind/';
    // return this.props.config.chat.endpoint
  },

  getInitialState: function(){
    return {'loading': true, "jid": false};
  },

  render: function() {
    if (this.state.loading){
      return (<p>loading chat</p>);
    }
    return (<p>Chat enabled. Talk to {this.state.jid}</p>);
  }
});

module.exports = {
  shouldBeLoaded: function(){
    console.log(this);
    return true;
  },
  component: ChatApp
}
