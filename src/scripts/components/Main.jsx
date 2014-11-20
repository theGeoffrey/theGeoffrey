/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    LogoComponent = require('./Logo'),
    SiteModel = require('../models/Site');


// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png'),
    model = new SiteModel({});

console.log(model);

var Main = React.createClass({
  render: function() {
    return (
      <div className='main'>
        <LogoComponent model={model} />
      </div>
    );
  }
});

React.renderComponent(<Main />, document.getElementById('content')); // jshint ignore:line

setTimeout(function(){
    model.set('logo', imageURL);
    console.log('after');
})

module.exports = Main;
