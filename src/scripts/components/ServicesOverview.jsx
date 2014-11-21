/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    Link = require('react-router-component').Link;

module.exports = React.createClass({
        render: function(){
            return(
                  <div>
                    Services:
                    <ul>
                        <li>
                            <Link href="/services/mailchimp">Mailchimp</Link>.
                        </li>
                        <li>
                            <Link href="/services/forms">Forms</Link>.
                        </li>
                        <li>
                            <Link href="/add_service/">+ Add</Link>.
                        </li>
                    </ul>
                  </div>
                )
        }
    });