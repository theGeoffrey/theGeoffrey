/** @jsx React.DOM */

'use strict';

var React = require('react/addons'),
    ReactBackboneMixin = require('backbone-react-component'),
    ReactTransitionGroup = React.addons.TransitionGroup,
    App = require('../stores/App');


module.exports = React.createClass({
    componentDidMount: function() {
        App.on('all', this._onChange);
    },
    getInitialState: function() {
        return App.attributes;
    },
    _onChange: function(){
        this.setState(App.attributes);
    },
    render: function () {
      return (
        <ReactTransitionGroup transitionName="fade">
          <dl id='app-config'>
            <dt>APP Key</dt>
            <dd>{this.state.api_key}</dd>
            <dt>Public Key</dt>
            <dd>{this.state.public_key}</dd>
            <dt>Discourse URL</dt>
            <dd>{this.state.dc_url}</dd>
          </dl>
        </ReactTransitionGroup>
        );
    }
});