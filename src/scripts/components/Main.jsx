/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    Router = require('./Router'),
    MainDispatcher = require('../dispatchers/Main'),
    Button = require('react-bootstrap').Button,
    ButtonToolbar = require('react-bootstrap').ButtonToolbar,
    MainConfig = require('./MainConfig');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');

var MainApp = React.createClass({
  componentDidMount: function(){
    MainDispatcher.dispatch({actionType: 'initMain'});
  },
  render: function() {
    return (
      <div className='main'>
        <ButtonToolbar>
            <Button>Default</Button>
            <Button bsStyle="primary"><i className="fa fa-heart"></i>Primary</Button>
            <Button bsStyle="success"><i className="fa fa-envelop"></i>Success</Button>
            <Button bsStyle="info"><i className="fa fa-times"></i>Info</Button>
            <Button bsStyle="warning"><i className="fa fa-bang"></i>Warning</Button>
            <Button bsStyle="danger"><i className="fa fa-error"></i>Danger</Button>
            <Button bsStyle="link"><i className="fa fa-link"></i>Link</Button>
        </ButtonToolbar>
        <MainConfig />
        <Router />
      </div>
    );
  }
});

React.render(<MainApp />, document.getElementById('content')); // jshint ignore:line
module.exports = MainApp;
