/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    APPS = require('./apps/_index'),
    Link = require('react-router-component').Link;


module.exports = React.createClass({
        render: function(){
            var App = APPS.get_app(this.props.app);
            var color = {color: 'white'}
            if(!App) {
                return (<div>Loading</div>)
            }

            App = App.component;

            return (
                <div classname= "selected-app-box" >
                    <App />
                    <Link style= {color} href="/">back</Link>
                </div>
                )
        }
    });