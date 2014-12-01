var Backbone = require('backbone'),
    Model = require('backbone-model').Model,
    PouchDB = require('pouchdb/dist/pouchdb.min.js'),
    BackbonePouch = require('backbone-pouch'),
    dbEndPoint = dbEndPoint || (window.location.hash ? atob(window.location.hash) : "http://127.0.0.1:5984/geoffrey"),
    db = PouchDB(dbEndPoint);

Backbone.sync = BackbonePouch.sync({db: db});
Backbone.Model.prototype.idAttribute = '_id';
Model.prototype.idAttribute = '_id';

// Setup our PouchDB adapter
module.exports = {db: db, sync: Backbone.sync};