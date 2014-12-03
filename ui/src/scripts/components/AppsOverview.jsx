/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    APPS = require('./apps/_index'),
    _helpers = require('./_helpers'),
    Link = require('react-router-component').Link;


module.exports = React.createClass({
    mixins: [_helpers.configRerenderMixin],
    render: function(){
        return(
            <div className="panel panel-primary">
                <div className="panel-heading">
                   <h3 className="panel-title">Apps</h3>
                </div>
                <div className="panel-body">
                    {_helpers.render_apps_list(
                        APPS.get_active_apps(this.state), true)}
                </div>
            </div>
            )
        }
    });