/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    APPS = require('./apps/_index'),
    Alert = require('react-bootstrap').Alert,
    _helpers = require('./_helpers'),
    Link = require('react-router-component').Link;


module.exports = React.createClass({
    mixins: [_helpers.configRerenderMixin],
    render: function(){
        var apps = APPS.get_apps_to_add(this.state);
        if (apps.length == 0){
            apps = (<Alert bsStyle="warning">
                         <p>No additional Apps found!</p>
                    </Alert>)
        } else {
            apps = _helpers.render_apps_list(apps)
        }
        return(
            <div className="panel panel-primary">
                <div className="panel-heading">
                   <h3 className="panel-title">Add App</h3>
                </div>
                <div className="panel-body">
                    {apps}
                    <Link href="/">Home</Link>
                </div>
            </div>
            )
        }
    });