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
    MainConfig = require('./MainConfig')
    Location = Router.Location;


var Configurator = React.createClass({
  mixins: [Router.NavigatableMixin],

  componentDidMount: function(){
    MainDispatcher.dispatch({actionType: 'initMain'});
  },

  render: function() {
    var showFullConfig = this.getPath() === '/';
    return (<div>
              <MainConfig showFull={showFullConfig} />
              <Locations hash>
                <Location path="/" handler={AppsOverview} />
                <Location path="/apps/add" handler={AddApp} />
                <Location path="/apps/:app" handler={AppPage} />
              </Locations>
            </div>);
  }
});


module.exports = Configurator;

