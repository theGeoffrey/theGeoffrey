
var strph = require("strophe"),
    stropheStore = require("./StropheStore"),
    simple_register = require("./_helpers").simple_register,
    whoami = stropheStore.whoami,
    getConnection = stropheStore.getConnection,
    Strophe = window.Strophe,
    Backbone = require('backbone');


// Yes, there is a MAM-plugin for strophe, the problem is,
// that it doesn't support our query and connects to the wrong namespace,
// let's build our own version then.

// We act with the ':tmp'-namespace, as implemented by mongooseim
Strophe.addNamespace('MAM', 'urn:xmpp:mam:tmp');

var Message = Backbone.Model.extend({
    isMine: function(){
        return !this.get("from") || (this.get("from") === whoami());
    }
});

var MessageCollection = Backbone.Collection.extend({
    model: Message
});

collection = new MessageCollection();


function query_message_archive(connection) {
    connection.addHandler(function(msg){
            console.log(arguments);
            actions.receiveMessage(msg);
        }, Strophe.NS.MAM, "message", null);


    // query as mongooseIM asks us to do
    // https://github.com/esl/MongooseIM/wiki/Recent-messages-in-MAM#get-last-50-messages
    // <iq type='get'>
    //   <query xmlns='urn:xmpp:mam:tmp'>
    //       <before/>
    //       <max>100</max>
    //   </query>
    // </iq>

    var query = $iq({type: "get"}
                 ).c("query", {xmlns: Strophe.NS.MAM}
                    ).c('before').up(
                    ).c('max'
                        ).t(100);
    console.log(query.tree());
    connection.sendIQ(query, function(){
        console.log("successfully send IQ", arguments);
    });
}

simple_register({
    "connected": function(){
        query_message_archive(getConnection());
    },
    "sendMessage": function(payload){
        collection.add(payload);
    },
    "receiveMessage": function(payload){
        collection.add(payload);
    }
});

module.exports = collection;
