var Backbone = require('backbone'),
    Model = require('backbone-model').Model,
    PouchDB = require('pouchdb/dist/pouchdb.min.js'),
    MainDispatcher = require('../dispatchers/Main'),
    BackbonePouch = require('backbone-pouch');


function _get_endpoint(inp){
    var BASE = window.GEOF_CONFIG.COUCH.DOMAIN,
        protocol = (window.GEOF_CONFIG.COUCH.PROTO || "http") + "://";

    if (inp === "geoffrey"){
        return protocol + BASE + "/geoffrey"
    } else if (inp == "fake"){
        return "fake";
    }
    // string of the format: base64(USER:PASS@DB)
    var login_source = atob(inp),
        parse_a = login_source.split("@", 2),
        database = parse_a[1] || "geoffrey",
        auth = parse_a[0],
        target = protocol + auth + "@" + BASE + "/" + database;

    return target;
}


Backbone.Model.prototype.idAttribute = '_id';
Model.prototype.idAttribute = '_id';

var currentDB = null;

// Setup our PouchDB adapter
module.exports = {
    sync: function proxy_sync(method, model, options) {
        return Backbone.sync.call(this, method, model, options);
    },
    hasDB: function(){
        return currentDB != null;
    },
    getDB: function(){
        return currentDB;
    },
    setDB: function(access_key) {
        var server;
        try {server = _get_endpoint(access_key);}catch(e){}
        while (!server){
          try {
            server = _get_endpoint(prompt("Please provide the access key:"));
          } catch (e){
            console.warn(e);
          }
        }
        var db = PouchDB(server);
        console && console.log("Loading from Database: " + server)
        Backbone.sync = BackbonePouch.sync({db: db});
        currentDB = db;
        if (server === "fake") {
            MainDispatcher.dispatch({actionType: 'fakeConfig'});
        }
        return db;
    }
};