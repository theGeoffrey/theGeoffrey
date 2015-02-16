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
    chatStates = require('./components/ChatConnectionState'),
    IconStateButton = chatStates.IconStateButton,
    IconStateLabel = chatStates.IconStateLabel,
    IconStateDot = chatStates.IconStateDot,
    ConnectionProgress = chatStates.ConnectionProgress,
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

var Message = React.createClass({
  componentDidMount: function(){
    this.props.model.on("change", function(){
      this.forceUpdate();
    }.bind(this));
  },
  render: function(){
    var model = this.props.model,
        cooked = model.getCooked(),
        id = model.id || model._cid,
        style = model.isMine() ? {"textAlign": "right"} : {},
        cls = model.isMine() ? "msgIn" : "msgOut";

    return (<div
              key={id}
              className={cls}
              style={style}
              dangerouslySetInnerHTML={{__html: cooked}}></div>)
  }
})

var Conversation = React.createClass({
  getInitialState: function(){
    return {msg: ''};
  },
  componentDidMount: function(){
    this.props.conversation.on("all", function() {
      this.forceUpdate();
    }.bind(this));
  },
  render: function(){
    var conversation = this.props.conversation,
        messages = conversation.getMessages().map(function(msg){
          return (<Message model={msg} />)
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
getInitialState: function(){
    return {text: ''};
  },
  render: function(){
    var disabled = this.props.conversationId == null;
    return (<div className="sendmsg">
              <form onSubmit={this.sendMessage}>
                <Input
                    disabled={disabled}
                    placeholder="message"
                    value={this.state.text}
                    onChange={this.didType}
                    type="text"
                    ref="message"
                    buttonAfter={<Button type="submit"><Glyphicon glyph="send" /></Button>} />
              </form>
            </div>);
  },
  didType: function(evt){
    this.setState({
      text: this.refs.message.getValue()
    });
  },

  sendMessage: function(evt){
    evt.preventDefault();
    console.log(this);
    var msg = this.refs.message.getValue().trim();
    this.refs.message.value = ''
    if (msg){
      actions.sendMessage({"to": this.props.conversationId,
                         "text": msg});

      this.setState({
        text: ''
    });
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
                  buttonAfter={<Button type="submit"><Glyphicon glyph="plus" /></Button>} />
            </form></div>)
  },

  startConversation: function(evt){
    evt.preventDefault();
    actions.startConversation(this.refs.jid.getValue());
    this.setState({jid: ''});
  }

});

var PlusButton = React.createClass({
  onClick: function(evt){
   this.props.onNew(!this.props.selectNew);
   console.log('SELECT NEW? 1:', this.props.selectNew)
  },

  render: function() {
    return (
      <div onClick={this.onClick} className="plusTab">
        <Glyphicon glyph="plus" />
      </div>
    );
  }
});

var ConvTab = React.createClass({

  onClick: function(evt){
    this.props.onSelect(this.props.conversation.id);
  },

  render: function() {
    var conversation = this.props.conversation;
    var state = this.props.active ? "activeConv" : "inactiveConv";
    
    return (
      <div onClick={this.onClick} className="convTab">
        <ConversationTitle conversation={conversation} />
        <div className={state} />
      </div>

      );
  }
});

var ConvTabs = React.createClass({

  render: function() {
    var conversations = this.props.conversations,
      selectedConv = this.props.selectedConv,
      onSelect = this.props.onSelect,
      onNew = this.props.onNew;


    var tabs = _.map(conversations, function(conv, idx){
                        var active = conv.id == selectedConv;
                        return (<ConvTab conversation={conv} active={active} onSelect={onSelect} />);
                      }.bind(this));
    console.log(tabs);
    return (
      <div className="convTabs"> 
        {tabs}
        <PlusButton onNew={onNew} selectNew={this.props.selectNew}/>
      </div>      
    );
  }
});

var ProfileBlock = React.createClass({
  render: function() {
    return (
      <div className="profileBlock">
        <div className="profileIcon">
          <IconStateDot className="profileIcon"/>
        </div>
        <div className="profileName">{this.props.nickname}</div>
      </div>
    );
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

    var chat_domain = this.props.config.chat_domain,
        public_key = this.props.settings.geoffrey_public_key;
    if (this.props.user){
      var username = this.props.user.username.toLowerCase();
      $.getJSON("/geoffrey/session.json").then(function(res){
        initConnection(null, chat_domain, username, res.id + "@" + public_key);
      })
    // } else {
    //   initConnection(null, chat_domain);
    }
  },

  getInitialState: function(){
    return {'loading': true, "jid": false,
             open: true, selectedConv: null, selectNew: false};
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
    var content = (<ConnectionProgress />),
        convs = conversationStore.models,
        clsname = "chat " + (this.state.open ? "open" : ""),
        nickname = this.state.loading ? 'loading' : this.state.jid.split('@')[0];
    if (!this.state.loading){
      if (conversationStore.length === 0 ){
       content = (<div className="selectConv"><p> Please start a conversation </p><NewConv /></div>);
      } 

      else if (this.state.selectNew){
        content = (<div className="selectConv"><p> Please start a conversation </p><NewConv /></div>);
      }
      else {

        var selectedConv = conversationStore.get(this.state.selectedConv),
        content = selectedConv ? (<Conversation
                                    conversation={selectedConv} />) : (<p className="selectConv">please select a conversation</p>);
        
      }
    }

    return (<div className={clsname}>
              <div className="chat-window">
              <ProfileBlock nickname={nickname} />
                <div className="chatBox">
                  <ConvTabs conversations={convs} selectedConv={selectedConv} onSelect={this.handleSelectConv} onNew={this.handlePlusPressed} selectNew={this.state.selectNew}/>
                  <div className="convWrap">
                    <SendMessage conversationId={this.state.selectedConv} />
                    {content}
                  </div>
                </div>
              </div>
            </div>);
  },

  handleSelectConv: function(selectedKey){
    this.setState({selectedConv: selectedKey});
     this.setState({selectNew: false});
  },

  handlePlusPressed: function(evt){
   this.setState({selectNew: true});
  }
});

module.exports = {
  shouldBeLoaded: function(){
    console.log(this);
    return true;
  },
  component: ChatApp
}
