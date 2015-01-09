/**
 * @jsx React.DOM
 */

'use strict';

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
        if (console && console.log){
            console.log(config, Discourse.SiteSettings, Discourse.User.current());
            console.log("Geoffrey embedded successfully.");
        }
    }

    window.__startGeoffrey = __startGeoffrey;

    // embed at the
    var gfr = document.createElement('script'); gfr.type = 'text/javascript'; gfr.async = true;
    gfr.src = endpoint + 'api/embed_config.json?jsonp=__startGeoffrey&public_key=' + public_key;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gfr, s);
})();