/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    queryString = require('query-string'),
    SockJS = require('sockjs-client'),
    rtbs = require('react-bootstrap'),
    Button = rtbs.Button,
    Input = rtbs.Input,
    Link = require('react-router-component').Link;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../styles/chat.less');

var ChatApp = React.createClass({


  componentDidMount: function(){
    var parsed = queryString.parse(location.search);
    if (!parsed.public_key){
      alert('No Public Key defined. Defunc!');
      return
    }
    if (!parsed.session){
      alert('No session defined. Defunc!');
      return
    }


    var socket = new SockJS(GEOF_CONFIG.CHAT_BASE + "/" + (parsed.public_key || 'geoffrey') + "/" + parsed.session + "/"),
        me = this;

    socket.onopen = function(e){
      socket.send(JSON.stringify({'command': 'ping'}));
    };

    socket.onmessage = function(e) {
      console.log(e);
      var messages = me.state.messages || [];
      messages.push(e);
      me.setState({'messages': messages});
    };

    this.socket = socket;
  },

  getInitialState: function(){
    return {'loading': true, "messages": []};
  },

  submitForm: function(){
    var msg = this.refs['msg'].getValue();
    this.socket.send(JSON.stringify({'type': 'chat', 'to': 'ben', 'message': msg}));
    // this.refs['msg'].setValue('');
    return false;
  },

  render: function() {
    return (
        <div>
          <div className='container'>
            {this.state.messages}
          </div>
          <div className="container">
            <form onSubmit={this.submitForm}>
              <Input type="text" ref='msg' />
              <Button type='submit'>send</Button>
            </form>
          </div>
        </div>
    );
  }
});

React.render(<ChatApp />, document.getElementById('content')); // jshint ignore:line
module.exports = ChatApp;
