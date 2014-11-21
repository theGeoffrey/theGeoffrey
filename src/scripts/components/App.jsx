/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    Router = require('./Router'),
    AppDispatcher = require('../dispatchers/App'),
    Button = require('react-bootstrap').Button,
    ButtonToolbar = require('react-bootstrap').ButtonToolbar,
    AppConfig = require('./AppConfig');


// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');

var App = React.createClass({
  componentDidMount: function(){
    AppDispatcher.dispatch({actionType: 'initApp'});
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
        <AppConfig />
        <Router />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('content')); // jshint ignore:line
module.exports = App;
