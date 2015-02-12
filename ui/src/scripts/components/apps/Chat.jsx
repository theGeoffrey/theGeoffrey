/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    SimpleAppMixin = require('./_mixin'),
     _ = require('underscore'),
    Router = require('react-router-component'),
    keyChecker = require("../_helpers").keyChecker,
    rtbs = require('react-bootstrap'),
    Input = rtbs.Input,
    BG_COLOR = 'rgb(133, 0, 192)',
    COLOR = 'white',
    updateConfig = require('../../actions/Config').updateConfig,
    stropheStore = require('../../chat/StropheStore'),
    initConnection = stropheStore.init,
    dispatcher = require('../../chat/dispatcher'),
    actions = require('../../chat/actions'),
    mucStore = require('../../chat/MucStore'),
    ListGroup = rtbs.ListGroup,
    ListGroupItem = rtbs.ListGroupItem,
    Well = rtbs.Well,
    rooms = mucStore.rooms,
    Button = rtbs.Button,
    fakerooms = ['oneRoom', 'twoRoom', 'threeRoom'],
    OAuth = window.OAuth;

var RoomsList = React.createClass({

  createRoom: function (evt){
    evt.preventDefault();
    var name = this.refs['name'].getValue().trim();
    actions.createRoom(name)
  },
  
  render: function(){
    return(
      <div>
      <Well bsSize="large">
      <form onSubmit={this.createRoom} className='form-horizontal'>
      <h4>Add a new room:</h4>
      <Input type='text' label="Room Name" labelClassName="col-xs-2" 
                      wrapperClassName="col-xs-10" value=""  
                      placeholder="Name" ref="name" /> 
        <Button bsStyle="success" className="btn btn-primary" type="submit">Add Room</Button>
      </form>
      <br />
      {_.map(fakerooms, function(name){
              return(
                <Well>
                <Button bsStyle="danger" bsSize="xsmall" className="btn btn-secondary chat-room">delete {name}</Button>
                <br />
                </Well>
              
            )})}
      </Well>
      </div>
      );
  }
});

var Chat = React.createClass({
  _color: COLOR,
  _bg_color: BG_COLOR,
  _key: 'chat',
  _sync_keys: ['rooms'],
  _services: ['chat_main', 'chat_shoutbox'],
  _name: "Chat",
  mixins: [SimpleAppMixin],

connectToChatServer: function (e) {
    e.preventDefault();
    initConnection()

    return false;
  },
  
  componentWillMount: function() {
    dispatcher.register(function(evt){
      if (evt.actionType == 'connected'){
        this.setState({loading: false, jid: evt.payload.jid})
      }
    }.bind(this));
},
  getInitialState: function(){
    return {'loading': true, "jid": false};
  },

  
  _render: function(){
    var server_mess = this.state.loading ? 'loading' : this.state.jid;
    var message = <h5><br /><strong>Connect to the server to view rooms</strong></h5>;
    var show_rooms = this.state.loading ? message : <RoomsList />;
  
  
    return(
      <div>
        <form onSubmit={this._defaultFormSubmit} className='form-horizontal'>
          <h3>Activate Chat</h3>
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
          <Input type='textarea' label="Server output:" labelClassName="col-xs-2" 
                      wrapperClassName="col-xs-10" value={server_mess}  
                      placeholder="Groups" readOnly ref="groups" /> 
          <button className="btn btn-primary btn-form" type="submit">Save</button>
        </form>
        <br />
         <h3>Manage Rooms</h3>
         {show_rooms}
        <button className="btn btn-primary btn-form" onClick={this.connectToChatServer}>Connect</button>
      </div>
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