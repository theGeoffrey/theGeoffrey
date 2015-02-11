
var strph = require("strophe"),
    dispatcher = require("./dispatcher"),
    whoami = require("./StropheStore").whoami,
    Strophe = window.Strophe,
    Backbone = require('backbone');

var Message = Backbone.Model.extend({
    isMine: function(){
        return !this.get("from") || (this.get("from") === whoami());
    }
});

var MessageCollection = Backbone.Collection.extend({
    model: Message
});

collection = new MessageCollection();

dispatcher.register(function(evt) {
    switch(evt.actionType){
        case 'sendMessage':
            console.log(evt.payload);
            collection.add(evt.payload);
        break;

        case 'receiveMessage':
            console.log(evt.payload);
            collection.add(evt.payload);
        break;
    }
});

module.exports = collection;
