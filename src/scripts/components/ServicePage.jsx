/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    services = require('./services/_services'),
    Link = require('react-router-component').Link;


module.exports = React.createClass({
        render: function(){
            var Service = services[this.props.service];
            return(
                  <div>
                    <Service />
                    <Link href="/">back</Link>
                  </div>
                )
        }
    });