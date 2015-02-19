
var strph = require("strophe"),
    {simple_register, whoami, getConnection} = require("./_helpers"),
    Strophe = window.Strophe,
    Backbone = require('backbone');


// Yes, there is a MAM-plugin for strophe, the problem is,
// that it doesn't support our query and connects to the wrong namespace,
// let's build our own version then.

// We act with the ':tmp'-namespace, as implemented by mongooseim
Strophe.addNamespace('MAM', 'urn:xmpp:mam:tmp');
Strophe.addNamespace('RSM', 'http://jabber.org/protocol/rsm');


//
// Unfortunately the Discourse.Onebox INSISTS on acting on live-elements
// that is very incomptabile with what we are doing here, so ...
//
// ONCE MORE: OUR OWN IMPLEMENTATION, YEAH
__onebox_url_cache = {}

var Message = Backbone.Model.extend({
    isMine: function(){
        return !this.get("from") || (this.get("from") === whoami());
    },

    _doOneBox: function(item){
        console.log(this, item);
        var url = item.href,
            model = this,
            cached = Discourse.Onebox.lookupCache(url);

        if (cached) {
            $(item).replaceWith(cached);
            return
        }

        // we cache our requests to enabled easier refresh management
        if (!__onebox_url_cache[url]){
            __onebox_url_cache[url] = Discourse.ajax("/onebox", {
              dataType: 'html',
              data: { url: url, refresh: false }
            });
        }

        var promise = __onebox_url_cache[url];

        promise.then(function(html) {
            Discourse.Onebox.cache(url, html);
            model._cooked = null;
            model.trigger("change");
        });
    },

    getCooked: function(){
        if (!this._cooked) {
            var $cook = $(Discourse.Markdown.cook(this.get("text")));
            $cook.find("a.onebox").each(function(idx, elem){
                this._doOneBox(elem)}.bind(this));;

            this._cooked = $cook.html();
        }
        return this._cooked;
    }
});

var MessageCollection = Backbone.Collection.extend({
    model: Message
});

collection = new MessageCollection();


function query_message_archive(connection) {
    // connection.addHandler(function(msg){
    //         console.log(arguments);
    //         actions.receiveMessage(msg);
    //     }, Strophe.NS.MAM, "message", null);

    // query whatever the MAM server condisers a good fallback amount...
    // <iq type='get'>
    //   <query xmlns='urn:xmpp:mam:tmp'>
    //      <set xmlns="http//jabber.org/protocol/rsm">
    //       <before/>
    //       <max>50</max>
    //       <simple />
    //      </set>
    //   </query>
    // </iq>
    //
    // inspired by
    // https://github.com/esl/MongooseIM/wiki/Recent-messages-in-MAM#get-last-50-messages
    // but without "simple", mongoose tells us we violate the policy ...
    // simple means, we don't want it to count the total – slow on PG anyways.

    var query = $iq({type: "get"}
                 ).c("query", {xmlns: Strophe.NS.MAM}
                    ).c("set", {xmlns: Strophe.NS.RSM}
                        ).c("before").up(
                        ).c('simple').up(
                        ).c("max").t(50);
    DEBUG && console.log(query.tree());
    connection.sendIQ(query, function(){
        DEBUG & console.log("successfully send IQ", arguments);
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
