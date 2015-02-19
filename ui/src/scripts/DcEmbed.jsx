/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    _ = require("underscore"),
    Chat = require('./ChatApp');

var apps = [Chat];

var EmbedApp = React.createClass({
    render: function(){
        var me = this,
            components = _.filter(apps, function(x){
                    return x.shouldBeLoaded.apply(me);
                }).map(function(x){
                    var component = x.component;
                    return (<component user={me.props.user}
                                       settings={me.props.settings}
                                       config={me.props.config} />)
                });
        DEBUG && console.log(components);
        return <div>{components}</div>;
    }
});

(function() {
    var Discourse = window.Discourse;
    if (!Discourse || !Discourse.SiteSettings) throw "This does not appear to be a Discourse Instance. Exiting.";

    var endpoint = Discourse.SiteSettings.geoffrey_endpoint,
        public_key = Discourse.SiteSettings.geoffrey_public_key;

    if (!endpoint || !public_key){
        alert("Geoffrey Installation not found. Please install the Geoffrey Plugin!");
        throw "Geoffrey Installation not found. Please install the Geoffrey Plugin!";
    }

    function __startGeoffrey(config){
        var baseDiv = document.createElement("div"),
            user = Discourse.User.current(),
            settings = Discourse.SiteSettings;

        // setup and add to DOM
        baseDiv.className = "geoffrey gfr gfr-dc";
        baseDiv.id = "geoffrey-base-div";
        document.getElementsByTagName("body")[0].appendChild(baseDiv);

        // Let's go!
        React.render(<EmbedApp user={user} config={config} settings={settings} />,
                      document.getElementById('geoffrey-base-div')); // jshint ignore:line

        if (DEBUG && console && console.log){
            console.log(config, Discourse.SiteSettings, Discourse.User.current());
            console.log("Geoffrey embedded successfully.");
        }
    }

    window.__startGeoffrey = __startGeoffrey;

    // embed at the
    var gfr = document.createElement('script'); gfr.type = 'text/javascript'; gfr.async = true;
    gfr.src = endpoint + 'api/start_embed.js?jsonp=__startGeoffrey&public_key=' + public_key;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gfr, s);
})();