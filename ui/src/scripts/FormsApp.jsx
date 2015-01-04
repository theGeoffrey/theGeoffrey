/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    Button = require('react-bootstrap').Button,
    Link = require('react-router-component').Link,
    Feedback = require('./templates/forms/feedback.jsx'),
    Contact = require('./templates/forms/contact.jsx')
    Support = require('./templates/forms/support.jsx')
    Router = require('react-router-component'),
    NotFound = Router.NotFound,
    Locations = Router.Locations,
    Location = Router.Location;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../styles/forms.less');

var IndexPage = React.createClass({
  render: function(){
    return (
          <div className='container'>
            <h2>Which form would like, sire?</h2>
            <ul>
              <li><Link href="#/form">To Feedback Forms</Link></li>
              <li><Link href="#/feedback">To Feedback Form</Link></li>
              <li><Link href='#/contact'>To Contact Form</Link></li>
              <li><Link href='#/support'>To Support Form</Link></li>
            </ul>
            <span>Delivered to you by theGeoffrey</span>
          </div>);
  }
});


var FormFound = React.createClass({
  render: function(){
    return (<span>Form found</span>);
  }
});

var FormsApp = React.createClass({

  getInitialState: function(){
    return {'hello': "anouk"};
  },

  render: function() {
    return (
        <div>
          <div className='container'>
            <Link href="/"><h1>Geoffrey Forms</h1></Link>
            Hello {this.state.hello}
          </div>
        </div>
    );
  }
});

React.render(<FormsApp />, document.getElementById('content')); // jshint ignore:line
module.exports = FormsApp;
