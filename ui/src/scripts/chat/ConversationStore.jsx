
var messages = require("./MessageStore"),
    strph = require("strophe"),
    _ = require("underscore"),
    dispatcher = require("./dispatcher"),
    Backbone = require('backbone'),
    {isMe,  getxConnection, parse_error_iq} = require("./_helpers"),
    {BaseModel, BaseCollection} = require("./_mixins"),
    Strophe = window.Strophe,
    $iq = window.$iq;


var Conversation = BaseModel.extend({
    defaults: {
        loading: false,
        error: false,
        isGroupChat: false,
    },
    _filter: function(msg){
        return msg && (msg.attributes.conversationId === this.id);
    },
    initialize: function(){
        this.messages = new Backbone.Collection();

        this.messages.once("add", function(msg){
            this.set("isGroupChat", msg.get("isGroupChat"))
        }.bind(this))

        messages.on("add", function(msg){
            if (this._filter(msg)) {
                this.messages.add(msg);
                this.trigger("changed");
            }
        }.bind(this));

        this.messages.add(_.filter(messages.models, this._filter.bind(this)));
        this.requeryInfo();
    },

    requeryInfo: function(){
        var model = this;
        this.set("loading", true);
        DEBUG && console.log(this.getConnection());
        if (this.get("isGroupChat")){
            this.getConnection().sendIQ(
                $iq({type: "get", to: this.id}
                    ).c("query", {"xmlns": "http://jabber.org/protocol/disco#info"})
                , function(iq){
                    DEGUG && console.log("ack", iq);
                }, function(iq){
                    model.set({"loading": false, "error": parse_error_iq(iq)});
                });
        }
    },

    getMessages: function(){
        return this.messages.models;
    }
});

var ConversationCollection = BaseCollection.extend({
    model: Conversation
});

var conversations = new ConversationCollection();

dispatcher.register(function(evt) {
    switch(evt.actionType){
        case 'startConversation':
            conversations.get_or_create(evt.payload.conversationId);
            break
        case 'sendMessage':
            conversations.get_or_create(evt.payload.conversationId);
            break;
        case 'receiveMessage':
            conversations.get_or_create(evt.payload.conversationId);
            break;
    }
});


module.exports = conversations;
