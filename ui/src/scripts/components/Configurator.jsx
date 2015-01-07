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
    Location = Router.Location;


var Configurator = React.createClass({

  componentDidMount: function(){
    MainDispatcher.dispatch({actionType: 'initMain'});
  },

  onBeforeNavigation: function(path){
    console.log(path);
    this.setState({"showFullConfig" : path === '/' });
  },

  onNavigation: function(path){
    console.log(path);
  },

  getInitialState: function(){
    return {'showFullConfig': true};
  },

  render: function() {
    return (<div>
              <MainConfig showFull={this.state.showFullConfig} />
              <Locations hash onBeforeNavigation={this.onBeforeNavigation} onNavigation={this.onNavigation}>
                <Location path="/" handler={AppsOverview} />
                <Location path="/apps/add" handler={AddApp} />
                <Location path="/apps/:app" handler={AppPage} />
              </Locations>
            </div>);
  }
});


module.exports = Configurator;

