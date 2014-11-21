/**
 * @jsx React.DOM
 */

var Router = require('react-router-component'),
    ServicesOverview = require('./ServicesOverview'),
    ServicePage = require('./ServicePage'),
    Locations = Router.Locations,
    Location = Router.Location;

module.exports = React.createClass({

  render: function() {
    return (
      <Locations>
        <Location path="/" handler={ServicesOverview} />
        <Location path="/services/:service" handler={ServicePage} />
      </Locations>
    )
  }
})

