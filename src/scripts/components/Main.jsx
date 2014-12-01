/**
 * @jsx React.DOM
 */

'use strict';

require("../stores/_db.js");

var React = require('react/addons'),
    Router = require('./Router'),
    MainDispatcher = require('../dispatchers/Main'),
    Button = require('react-bootstrap').Button,
    Link = require('react-router-component').Link
    ButtonToolbar = require('react-bootstrap').ButtonToolbar,
    MainConfig = require('./MainConfig');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/main.less');

var imageURL = require('../../images/yeoman.png');

var MainApp = React.createClass({
  componentDidMount: function(){
    MainDispatcher.dispatch({actionType: 'initMain'});
  },
  render: function() {
    return (
        <div>
          <div className='container'>
            <Link href="/"><h1>theGeoffrey</h1></Link>
          </div>
          <div className='main container'>
            <MainConfig />
            <Router />
          </div>
        </div>
    );
  }
});

React.render(<MainApp />, document.getElementById('content')); // jshint ignore:line
module.exports = MainApp;
