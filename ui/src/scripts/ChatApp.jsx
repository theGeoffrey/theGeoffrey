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

var ChatToggle = React.createClass({
  render: function(){
    return (<i onClick={this.toggle} className="fa fa-comments-o"></i>)
  },
  toggle: function(evt){
    this.props.toggle();
    return false;
  },
});

var ChatApp = React.createClass({

  componentWillMount: function() {
    dispatcher.register(function(evt){
      console.log(evt);
      if (evt.actionType == 'connected'){
        this.setState({loading: false, jid: evt.payload.jid})
      }
    }.bind(this));

    // injecting in ember, oh, we are snarky!
    $(".d-header ul[role='navigation']").prepend($('<li id="gfr-chat-toggle"></li>'));
    React.render(<ChatToggle toggle={this._toggleWindow} />,
        document.getElementById('gfr-chat-toggle'));
  },
  componentDidMount: function(){
    initConnection();
  },

  getEndpoint: function(){
    return 'http://chat.thegeoffrey.co/http-bind/';
    // return this.props.config.chat.endpoint
  },

  getInitialState: function(){
    return {'loading': true, "jid": false, open: true};
  },

  _toggleWindow: function(){
    this.setState({open: !this.state.open});
  },

  render: function() {
    var content = (<p>loading chat</p>),
        clsname = "chat " + (this.state.open ? "open" : "");
    if (!this.state.loading){
      content = (<p>Chat enabled. Talk to {this.state.jid}</p>);
    }

    return (<div className={clsname}>
              <div className="chat-window">
                {content}
                <button onClick={this._toggleWindow} className='btn btn-primary'>close window</button>
              </div>
            </div>);
  }
});

module.exports = {
  shouldBeLoaded: function(){
    console.log(this);
    return true;
  },
  component: ChatApp
}
