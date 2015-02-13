
var messages = require("./MessageStore"),
    isMe = require("./StropheStore").isMe,
    _ = require("underscore"),
    dispatcher = require("./dispatcher")
    Backbone = require('backbone');

var Conversation = Backbone.Model.extend({
    _filter: function(msg){
        return msg && (msg.attributes.to === this.id || msg.attributes.from === this.id);
    },
    initialize: function(){
        messages.on("add", function(msg){
            if (this._filter(msg)) this.trigger("change");
        }.bind(this));
    },
    getMessages: function(){
        return _.filter(messages.models, this._filter.bind(this));
    }
});

var ConversationCollection = Backbone.Collection.extend({
    model: Conversation,
    get_or_create: function(id){
        var mdl = this.get(id);
        console.log(id);
        if (!mdl) {
            return this.add({id: id})
        }
    },
});

var convsersations = new ConversationCollection();

dispatcher.register(function(evt) {
    switch(evt.actionType){
        case 'startConversation':
        convsersations.get_or_create(evt.payload);
        break
        case 'sendMessage':
        convsersations.get_or_create(evt.payload.to);
        break;
        case 'receiveMessage':
        convsersations.get_or_create(isMe(evt.payload.from) ? evt.payload.to : evt.payload.from);
        break;
    }
});


module.exports = convsersations;
