/**
 * @jsx React.DOM
 */

'use strict';
var React = require('react'),
    _ = require('underscore'),
    Link = require('react-router-component').Link,
    Config = require('../stores/Config');


module.exports = {
    configRerenderMixin: {
        componentDidMount: function() {
          Config.on('all sync', this._onChange);
        },
        getInitialState: function() {
          return _.clone(Config.attributes);
        },
        _onChange: function(){
          if (this.isMounted()) {
            this.setState(Config.attributes);
          }
        },
    },


    keyChecker: function (key, inverse){
        return function(config){
            var contains = _.isObject(config[key]);
            if (inverse) { contains =! contains};
            return contains;
        }
    },

    render_apps_list: function(apps, has_add){
        var add_button = "";
        if (has_add){
            add_button = (<li>
                    <Link  href="/apps/add">
                        <span className="addBox"
                          >+ Add</span>
                    </Link>
                </li>)
        }

        return (<ul className="apps-list">
            {_.map(apps, function(app){
                var href = "/apps/" + app[0],
                    app = app[1],
                    styles ={"background-color": app.bg_color,
                             "color": app.color},
                    icon = app.letter;

                if (app.fa){
                    var className = "fa fa-" + app.fa;
                    icon = (<span className={className}></span>)
                };

                return (
                      <li>
                        <Link href={href}>
                            <span className="appBox"
                                  style={styles}
                              >{icon}</span>
                        {app.name}
                        </Link>
                      </li>)
            })}
            {add_button}
        </ul>)
    }
}