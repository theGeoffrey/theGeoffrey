var Backbone = require('backbone'),
    Model = require('backbone-model').Model,
    PouchDB = require('pouchdb/dist/pouchdb.min.js'),
    BackbonePouch = require('backbone-pouch');


function _get_endpoint(inp){
    var BASE = window.GEOF_CONFIG.COUCH_SERVER || "localhost:5984",
        protocol = window.GEOF_CONFIG.COUCH_PROTO || "http://";

    if (inp === "geoffrey"){
        return protocol + BASE + "/geoffrey"
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

var currentDB;

// Setup our PouchDB adapter
module.exports = {
    sync: function proxy_sync(method, model, options) {
        return Backbone.sync.call(this, method, model, options);
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
        return db;
    }
};