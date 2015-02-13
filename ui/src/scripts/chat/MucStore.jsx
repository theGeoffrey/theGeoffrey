'use strict';

var strph = require("strophe"),
    dispatcher = require("./dispatcher"),
    Strophe = window.Strophe,
    muc = require("strophe-plugins/muc"), // Multi User Chat
    stropheStore = require('./StropheStore'),
    getConnection = stropheStore.getConnection,
    actions = require("./actions"),
    Backbone = require('backbone');

var Room = Backbone.Model.extend({});
var RoomCollection = Backbone.Collection.extend({
    model: Room
});

var rooms = new RoomCollection();

function parseRooms(rooms){
    console.log("INCOMING ROOMS:", rooms.outerHTML);
}


function createdRoom(success){
    console.log('successfully created room', success.outerHTML);
    actions.roomCreated(success);
    getRooms('muc.chat.thegeoffrey.co');
}

function getRooms(url){
     getConnection().muc.listRooms(url, parseRooms, failureToGetRooms);
}

function failureToCreateRoom(failure){
    console.log('failure to create room ', failure);
    actions.failureToCreateRoom(failure);
}

function failureToGetRooms(failure){
    console.log('failure to get rooms ', failure);
    actions.failureToGetRooms(failure);
}

dispatcher.register(function(evt) {
    switch(evt.actionType){
        case "connected":
        getRooms('muc.chat.thegeoffrey.co');
        break

        case "createRoom":
        var name = evt.payload;
        console.log(getConnection().muc.createInstantRoom(name, createdRoom, failureToCreateRoom));
        break

        case "deleteRoom":
        break
    }
});

module.exports = rooms;