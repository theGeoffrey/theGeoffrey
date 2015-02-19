
var Backbone = require('backbone');

var BaseCollection = Backbone.Collection.extend({
    get_or_create: function(id){
        var mdl = this.get(id);
        if (!mdl) {
            DEBUG && console.log("Creating", this, id);
            return this.add({id: id});
        }
    }
});

var BaseModel = Backbone.Model.extend({
  getConnection: function() {
    return require("./_helpers").getConnection()
  }
});

module.exports = {
    BaseCollection: BaseCollection,
    BaseModel: BaseModel
}