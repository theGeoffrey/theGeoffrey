/**
 * @jsx React.DOM
 */

'use strict';

require("./stores/_db.js");


var React = require('react/addons'),
    Router = require('./components/Router'),
    MainDispatcher = require('./dispatchers/Main'),
    Button = require('react-bootstrap').Button,
    Link = require('react-router-component').Link,
    MainConfig = require('./components/MainConfig');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../styles/main.less');

var imageURL = require('../images/yeoman.png');

var MainApp = React.createClass({
  componentDidMount: function(){
    MainDispatcher.dispatch({actionType: 'initMain'});
  },

  onBeforeNavigation: function(path){
    this.setState({"showFullConfig" : path === '/' });
  },

  onNavigation: function(){
  },

  getInitialState: function(){
    return {'showFullConfig': true};
  },

  render: function() {
    return (
        <div>
          <div className='container'>
            <Link href="/"><h1>theGeoffrey</h1></Link>
          </div>
          <div className='main container'>
            <MainConfig showFull={this.state.showFullConfig} />
            <Router onNavigation={this.onNavigation} onBeforeNavigation={this.onBeforeNavigation}  />
          </div>
        </div>
    );
  }
});

React.render(<MainApp />, document.getElementById('content')); // jshint ignore:line
module.exports = MainApp;
