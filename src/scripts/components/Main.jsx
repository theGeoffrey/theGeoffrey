/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    LogoComponent = require('./Logo'),
    site = require('../stores/Site');


// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');
console.log(site);

var Main = React.createClass({
  render: function() {
    return (
      <div className='main'>
        <LogoComponent />
      </div>
    );
  }
});

React.renderComponent(<Main />, document.getElementById('content')); // jshint ignore:line
site.set('logo', imageURL)
module.exports = Main;
