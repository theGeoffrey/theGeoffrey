'use strict';

var strph = require("strophe"),
    dispatcher = require("./dispatcher"),
    Strophe = window.Strophe,
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
    console.log("INCOMING ROOMS:",rooms);
} 

function createdRoom(success){
    console.log('successfully created room', success);
    actions.roomCreated(success);
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
        getConnection().muc.listRooms('chat.thegeoffrey.co', parseRooms, failureToGetRooms);
        break

        case "createRoom":
        getConnection().muc.createConfiguredRoom(evt.payload, {"muc#roomconfig_publicroom": "1", "muc#roomconfig_persistentroom": "1"}, createdRoom, failureToCreateRoom);
        break

        case "deleteRoom":
        break
    }
});

module.exports = rooms;