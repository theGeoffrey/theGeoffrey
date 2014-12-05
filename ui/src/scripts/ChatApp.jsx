/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    Button = require('react-bootstrap').Button,
    Link = require('react-router-component').Link;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../styles/chat.less');

var ChatApp = React.createClass({

  getInitialState: function(){
    return {'hello': "anouk"};
  },

  render: function() {
    return (
        <div>
          <div className='container'>
            <Link href="/"><h1>Geoffrey Chat</h1></Link>
            {this.state.hello}
          </div>
        </div>
    );
  }
});

React.render(<ChatApp />, document.getElementById('content')); // jshint ignore:line
module.exports = ChatApp;
