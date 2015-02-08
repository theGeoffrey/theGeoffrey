/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    initConnection = require('./chat/StropheStore'),
    messageStore = require('./chat/MessageStore'),
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

    console.log(this.props);

    if (this.props.user){
      var username = this.props.user.username.toLowerCase();
      $.getJSON("/geoffrey/session.json").then(function(res){
        console.log(res);
        initConnection(null, null, username, res.id);
      })
    } else {
      initConnection();
    }
  },
  componentDidMount: function(){
    messageStore.on("all", function(){
      console.log("ALL");
      this.refreshData();
    }.bind(this))

  },

  refreshData: function(){
    this.setState({"messages": messageStore});
  },

  getInitialState: function(){
    return {'loading': true, "jid": false, open: true, messages: []};
  },

  _toggleWindow: function(){
    this.setState({open: !this.state.open});
  },

  render: function() {
    var content = (<p>loading chat</p>),
        clsname = "chat " + (this.state.open ? "open" : "");
    if (!this.state.loading){
      if (this.state.messages.length) {
        var messages = this.state.messages.map(function(x){
          var msg = x.attributes;
          return (<div>
                    <p>{msg.from}</p> said
                    <p>{msg.text}</p>
                  </div>)
        });
        content = (<div>
                    {messages}
                    <p>Yay, you are chatting with {this.state.jid}</p>
                  </div>);
      } else{
        content = (<p>Chat enabled. Talk to {this.state.jid}</p>);
      }
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
