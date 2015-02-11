/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    stropheStore = require('./chat/StropheStore'),
    initConnection = stropheStore.init,
    whoami = stropheStore.whoami,
    messageStore = require('./chat/MessageStore'),
    conversationStore = require('./chat/ConversationStore'),
    dispatcher = require('./chat/dispatcher'),
    IconStateButton = require('./components/ChatConnectionState').IconStateButton,
    queryString = require('query-string'),
    rtbs = require('react-bootstrap'),
    actions = require('./chat/actions'),
    Button = rtbs.Button,
    DropdownButton = rtbs.DropdownButton,
    MenuItem = rtbs.MenuItem,
    TabbedArea = rtbs.TabbedArea,
    TabPane = rtbs.TabPane,
    Input = rtbs.Input,
    Glyphicon = rtbs.Glyphicon,
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

var Conversation = React.createClass({
  getInitialState: function(){
    return {msg: ''};
  },
  componentDidMount: function(){
    this.props.conversation.on("all", function() {
      this.setState({});
    }.bind(this));
  },
  render: function(){
    var conversation = this.props.conversation,
        messages = conversation.getMessages().map(function(msg){
          var user = msg.attributes.from,
              text = msg.attributes.text,
              style = msg.isMine() ? {"text-align": "right"} : {};

          return (<p style={style}>{text}</p>)
        }.bind(this));

    return (<div className="conversation">
              <div className="messagesWrap">
                <div className="messages">
                  {messages}
                </div>
              </div>
            </div>);
  }
});

var ConversationTitle = React.createClass({
  render: function() {
    var name = this.props.conversation.id[0];
    return (<span>{name}</span>);
  }
});

var SendMessage = React.createClass({

  render: function(){
    var disabled = this.props.conversationId == null;
    return (<div className="sendmsg">
              <form onSubmit={this.sendMessage}>
                <Input
                    disabled={disabled}
                    placeholder="message"
                    type="text"
                    ref="message"
                    buttonAfter={<Button type="submit"><Glyphicon glyph="send" /></Button>} />
              </form>
            </div>);
  },

  sendMessage: function(evt){
    evt.preventDefault();
    console.log(this);
    var msg = this.refs.message.getValue().trim();
    if (msg){
      actions.sendMessage({"to": this.props.conversationId,
                         "text": msg});
    }
  }

});

var NewConv = React.createClass({

  getInitialState: function(){
    return {jid: ''};
  },

  render: function(){
    return (<div><form onSubmit={this.startConversation}>
              <Input
                  placeholder="username"
                  type="text"
                  ref="jid"
                  buttonBefore={<IconStateButton />}
                  buttonAfter={<Button type="submit"><Glyphicon glyph="plus" /></Button>} />
            </form></div>)
  },

  startConversation: function(evt){
    evt.preventDefault();
    actions.startConversation(this.refs.jid.getValue());
    this.setState({jid: ''});
  }

});


var ChatApp = React.createClass({

  componentWillMount: function() {
    dispatcher.register(function(evt){
      if (evt.actionType == 'connected'){
        this.setState({loading: false, jid: evt.payload.jid})
      }
    }.bind(this));

    // injecting in ember, oh, we are snarky!
    $(".d-header ul[role='navigation']").prepend($('<li id="gfr-chat-toggle"></li>'));
    React.render(<ChatToggle toggle={this._toggleWindow} />,
        document.getElementById('gfr-chat-toggle'));


    if (this.props.user){
      var username = this.props.user.username.toLowerCase();
      $.getJSON("/geoffrey/session.json").then(function(res){
        initConnection(null, null, username, res.id);
      })
    } else {
      initConnection();
    }
  },

  getInitialState: function(){
    return {'loading': true, "jid": false,
             open: true, selectedConv: null};
  },

  componentDidMount: function(){
    conversationStore.on("all", function(){
      this.forceUpdate();
    }.bind(this))
  },

  _toggleWindow: function(){
    this.setState({open: !this.state.open});
  },

  render: function() {
    var content = (<p>loading chat</p>),
        convTabs = null,
        clsname = "chat " + (this.state.open ? "open" : "");
    if (!this.state.loading){
      if (conversationStore.length === 0 ){
       content = (<p> Please start a conversation </p>);
      } else {

        var tabs = _.map(conversationStore.models, function(conv, idx){
                        return (<TabPane tab={<ConversationTitle conversation={conv} />}
                                    key={conv.id} eventKey={conv.id}>
                                </TabPane>);
                      }),
        selectedConv = conversationStore.get(this.state.selectedConv),
        content = selectedConv ? (<Conversation
                                    conversation={selectedConv} />) : (<p>please select a conversation</p>);
        convTabs = (<TabbedArea activeKey={this.state.selectedConv}
                                onSelect={this.handleSelectConv}>
                    {tabs}
                  </TabbedArea>);
        console.log(selectedConv, this.state.selectedConv);
      }
    }

    return (<div className={clsname}>
              <div className="chat-window">
                <NewConv />
                {convTabs}
                <div className="chatBox">
                  {content}
                </div>
                <SendMessage conversationId={this.state.selectedConv} />
              </div>
            </div>);
  },

  handleSelectConv: function(selectedKey){
    this.setState({selectedConv: selectedKey});
  }
  //<button onClick={this._toggleWindow} className='btn btn-primary'>close window</button>
});

module.exports = {
  shouldBeLoaded: function(){
    console.log(this);
    return true;
  },
  component: ChatApp
}
