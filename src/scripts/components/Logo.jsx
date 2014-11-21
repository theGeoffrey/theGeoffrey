/** @jsx React.DOM */

'use strict';

var React = require('react/addons'),
    SiteActions = require('../actions/Site'),
    ReactBackboneMixin = require('backbone-react-component'),
    ReactTransitionGroup = React.addons.TransitionGroup,
    site = require('../stores/Site'),
    LogoComponent = React.createClass({
    componentDidMount: function() {
        site.on('all', this._onChange);
    },
    getInitialState: function() {
        return {};
    },
    _onChange: function(){
        this.setState(site.attributes);
    },
      render: function () {
        return (
            <ReactTransitionGroup transitionName="fade">
              <img src={this.state.logo} />
              <h2>{this.state.title}</h2>
              <button onClick={this._toggle}>Toggle</button>
            </ReactTransitionGroup>
            );
      },
      _toggle: function(){
        var new_title = this.state.title == 'GEO' ? 'Geoffrey UI': 'GEO'
        SiteActions.setTitle(new_title);
      }
    });

module.exports = LogoComponent;