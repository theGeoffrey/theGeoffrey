/** @jsx React.DOM */

'use strict';

var React = require('react/addons'),
    ReactBackboneMixin = require('backbone-react-component'),
    ReactTransitionGroup = React.addons.TransitionGroup,
    LogoComponent = React.createClass({
      mixins: [ReactBackboneMixin],
      render: function () {
        return (
            <ReactTransitionGroup transitionName="fade">
              <img src={this.props.logo} />
            </ReactTransitionGroup>
            );
      }
    });

module.exports = LogoComponent;