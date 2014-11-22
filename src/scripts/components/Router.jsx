/**
 * @jsx React.DOM
 */

var Router = require('react-router-component'),
    AppsOverview = require('./AppsOverview'),
    AddApp = require('./AddApp'),
    AppPage = require('./AppPage'),
    Locations = Router.Locations,
    Location = Router.Location;

module.exports = React.createClass({

  render: function() {
    return (
      <Locations>
        <Location path="/" handler={AppsOverview} />
        <Location path="/apps/add" handler={AddApp} />
        <Location path="/apps/:app" handler={AppPage} />
      </Locations>
    )
  }
})

