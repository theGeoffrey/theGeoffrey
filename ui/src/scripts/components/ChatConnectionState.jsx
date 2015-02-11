/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    Label = require("react-bootstrap").Label,
    Button = require("react-bootstrap").Button,
    ProgressBar = require("react-bootstrap").ProgressBar,
    dispatcher = require("../chat/dispatcher");

function defaultChatState(){
    return {chatError: false, chatState: false};
}


var ConnectionStateMixin = {
    componentWillMount: function(){
        dispatcher.register(this._dispatched);
    },
    componentWillUnmount: function () {
        dispatcher.unregister(this._dispatched);
    },
    getChatBsStyle: function(){
        return ({"connected" : "success",
                "connecting": "info",
                "authenticating": "warning",
                "authFailed": "danger",
                "connFailed": "danger",
                "disconnecting": "info",
                "disconnected": "warning"}[this.state.chatState] || "default");
    },
    getChatIconState: function(){
        return "fa " + ({"connected" : "fa-checked-circle",
                         "connecting": "fa-arrow-circle-o-up",
                         "authenticating": "fa-arrow-circle-o-up",
                         "authFailed": "fa-times-circle-o",
                         "connFailed": "fa-times-circle-o",
                         "disconnecting": "fa-arrow-circle-o-down",
                         "disconnected": "fa-times-circle-o",
                     }[this.state.chatState] || "fa-circle-o");
    },
    _dispatched: function (evt) {
        if (evt.actionType === "connected" || evt.actionType === "attached"){
            this.setState({chatConnected: true, chatError: false, chatState: "connected"});
        } else if ([0,
                "connecting", "authenticating",
                "authFailed", "connFailed", "attached",
                "disconnecting", "disconnected"].indexOf(evt.actionType))
        {
            var new_state = {chatConnected: evt.actionType == "disconnecting", chatState: evt.actionType};
            if (evt.actionType === "authFailed" || evt.actionType === "conFailed"){
                new_state["chatError"] = evt.payload.reason;
            }
            this.setState(new_state);
        }
    }
};


var IconStateLabel = React.createClass({
    mixins: [ConnectionStateMixin],
    getInitialState: defaultChatState,
    render: function(){
        var classNames = this.getChatIconState(),
            bsStyle = this.getChatBsStyle(),
            title = this.state.chatError || this.state.chatState;

        return (<Label bsStyle={bsStyle}><span className={classNames} title={title}></span></Label>);
    }
});

var IconStateButton = React.createClass({
    mixins: [ConnectionStateMixin],
    getInitialState: defaultChatState,
    render: function(){
        var classNames = this.getChatIconState(),
            bsStyle = this.getChatBsStyle(),
            title = this.state.chatError || this.state.chatState;

        return (<Button bsStyle={bsStyle}><span className={classNames} title={title}></span></Button>);
    }
})

var ConnectionProgress = React.createClass({
    mixins: [ConnectionStateMixin],
    getInitialState: defaultChatState,
    getPercent: function(){
        return ({"connected" : 100,
                "connecting": 30,
                "authenticating": 50,
                "authFailed": 100,
                "connFailed": 100,
                "disconnecting": 90,
                "disconnected": 100}[this.state.chatState] || 10);
    },
    render: function(){
        var percent = this.getPercent(),
            bsStyle = this.getChatBsStyle(),
            title = this.state.chatError || this.state.chatState;

        if (percent <= 70)
            return (<ProgressBar bsStyle={bsStyle} active  now={percent} label={title} />)
        else
            return (<ProgressBar bsStyle={bsStyle} now={percent} label={title} />)
    }
});


module.exports = {IconStateLabel: IconStateLabel,
                  IconStateButton: IconStateButton,
                  ConnectionStateMixin: ConnectionStateMixin,
                  ConnectionProgress: ConnectionProgress}