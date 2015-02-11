/**
 * @jsx React.DOM
 */

var React = require('react/addons'),
    Router = require('react-router-component'),
    AppsOverview = require('./AppsOverview'),
    MainDispatcher = require('../dispatchers/Main'),
    AddApp = require('./AddApp'),
    AppPage = require('./AppPage'),
    Locations = Router.Locations,
    MainConfig = require('./MainConfig'),
    getDB = require("../stores/_db").getDB,
    Location = Router.Location;


var Configurator = React.createClass({
  mixins: [Router.NavigatableMixin],

  componentDidMount: function(){
    MainDispatcher.dispatch({actionType: 'initMain'});
  },

  render: function() {
    var showFullConfig = this.getPath() === '/',
        db_link = document.createElement("a");

    // URL parsing
    db_link.href = getDB()._db_name;

    var public_key = (db_link.pathname || "/fake").slice(1),
        api_key = db_link.username + ":" + db_link.password + "@" + public_key;

    // console.log(db_link.host, db_link.hostname, db_link.username, db_link.password, db_link.pathname);
    return (<div>
              <MainConfig showFull={showFullConfig} public_key={public_key} api_key={api_key} />
              <Locations hash>
                <Location path="/" handler={AppsOverview} />
                <Location path="/apps/add" handler={AddApp} />
                <Location path="/apps/:app" handler={AppPage} />
              </Locations>
            </div>);
  }
});


module.exports = Configurator;

