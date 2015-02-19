
var Backbone = require('backbone'),
    {isFromMyCommunity} = require("./_helpers"),
    BaseCollection = require("./_mixins").BaseCollection;

var User = Backbone.Model.extend({
    initialize: function(){
        var jid = this.id;
        if (isFromMyCommunity(jid)){
            this.fetchLocalUserInfo();
        } else {
            DEBUG && console.warn("User not from this community ... NOT YET SUPPORTED");
            // not yet supported
        }
    },
    fetchLocalUserInfo: function(){
        var username = Strophe.getBareJidFromJid(this.id).split("@", 1)[0],
            model = this;

        this.set("loading", true);
        PreloadStore.getAndRemove("user_" + username, function() {
                return Discourse.ajax("/users/" + username + '.json');
            }).then(function (json) {
                DEBUG && console.log(json);
                var payload = json.user;
                payload.badges = json.badges;
                payload.loading = false;
                model.set(payload);
            });
    },
    getProfilePictureURL: function(size){
        var size = size || 45;
        return this.get("avatar_template").replace("{size}", size);
    }
});

var Users = BaseCollection.extend({
    model: User
});


var users = new Users();

module.exports = {
    "users": users
}