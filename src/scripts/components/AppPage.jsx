/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    APPS = require('./apps/_index'),
    Link = require('react-router-component').Link;


module.exports = React.createClass({
        render: function(){
            var App = APPS[this.props.app];
            return(
                <div>
                    <App />
                    <Link href="/">back</Link>
                </div>
                )
        }
    });