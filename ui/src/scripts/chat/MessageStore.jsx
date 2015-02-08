
var strph = require("strophe"),
    dispatcher = require("./dispatcher"),
    Strophe = window.Strophe,
    Backbone = require('backbone');

var Message = Backbone.Model.extend({});

var MessageCollection = Backbone.Collection.extend({
    model: Message
});

collection = new MessageCollection();

dispatcher.register(function(evt) {
    console.log(evt);
    switch(evt.actionType){
        case 'receiveMessage':
        collection.add(evt.payload);
        break
    }
});

module.exports = collection;
