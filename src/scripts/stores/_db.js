var Backbone = require('backbone'),
    Model = require('backbone-model').Model,
    PouchDB = require('pouchdb/dist/pouchdb.min.js'),
    BackbonePouch = require('backbone-pouch');


function _get_endpoint(){
    var BASE = window.GEOF_CONFIG.COUCHDB_DOMAIN || "localhost:5984";
    if (!window.location.hash){
        return "http://" + BASE + "/geoffrey"
    }
    // string of the format: USER:PASS@DB
    var login_source = atob(window.location.hash.slice(1)),
        parse_a = login_source.split("@", 2),
        database = parse_a[1] || "geoffrey",
        auth = parse_a[0],
        target = "http://" + auth + "@" + BASE + "/" + database;

    console && console.log("Loading from Database: " + target)
    return target;
}


var db = PouchDB(_get_endpoint());

Backbone.sync = BackbonePouch.sync({db: db});
Backbone.Model.prototype.idAttribute = '_id';
Model.prototype.idAttribute = '_id';

// Setup our PouchDB adapter
module.exports = {db: db, sync: Backbone.sync};