/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    Link = require('react-router-component').Link;

module.exports = React.createClass({
        render: function(){
            return(
                <div className="panel panel-primary">
                    <div className="panel-heading">
                       <h3 className="panel-title">Apps</h3>
                    </div>
                    <div className="panel-body">
                        <ul>
                            <li>
                                <Link href="/apps/mailchimp">Mailchimp</Link>.
                            </li>
                            <li>
                                <Link href="/apps/forms">Forms</Link>.
                            </li>
                            <li>
                                <Link href="/add_service/">+ Add</Link>.
                            </li>
                        </ul>
                    </div>
                </div>
                )
        }
    });