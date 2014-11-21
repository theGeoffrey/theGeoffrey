/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    Router = require('./Router'),
    AppDispatcher = require('../dispatchers/App'),
    AppConfig = require('./AppConfig');


// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');

var App = React.createClass({
  componentDidMount: function(){
    AppDispatcher.dispatch({actionType: 'initApp'});
  },
  render: function() {
    return (
      <div className='main'>
        <AppConfig />
        <Router />
      </div>
    );
  }
});

React.renderComponent(<App />, document.getElementById('content')); // jshint ignore:line
module.exports = App;
