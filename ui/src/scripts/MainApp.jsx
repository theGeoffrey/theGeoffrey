/**
 * @jsx React.DOM
 */

'use strict';

;


var React = require('react/addons'),
    AppRouter = require('./components/Router'),
    Router = require('react-router-component'),
    MainDispatcher = require('./dispatchers/Main'),
    $ = require("jQuery"),
    Twbs = require('react-bootstrap'),
    Button = Twbs.Button,
    ProgressBar = Twbs.ProgressBar,
    Link = require('react-router-component').Link,
    setDB = require("./stores/_db.js").setDB,
    Location = Router.Location,
    Locations = Router.Locations,
    MainConfig = require('./components/MainConfig'),
    config = Config = require('./stores/Config');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../styles/main.less');

var imageURL = require('../images/yeoman.png');

var Configurator = React.createClass({
  componentDidMount: function(){
    MainDispatcher.dispatch({actionType: 'initMain'});
  },

  onBeforeNavigation: function(path){
    this.setState({"showFullConfig" : path === '/' });
  },

  onNavigation: function(){
  },

  getInitialState: function(){
    return {'showFullConfig': true, "loading": true};
  },

  render: function() {
    return (
        <div>
          <div className='container'>
            <Link href="/"><h1>theGeoffrey</h1></Link>
          </div>
          <div className='main container'>
            <MainConfig showFull={this.state.showFullConfig} />
            <AppRouter onNavigation={this.onNavigation} onBeforeNavigation={this.onBeforeNavigation}  />
          </div>
        </div>
    );
  }
});

var LoginHandler = React.createClass({
  mixins: [Router.NavigatableMixin],
  componentDidMount: function(){
    console.log(this.props);

    var db = setDB(this.props.key);
    this.setState({progress: 15});

    var dfr = $.Deferred();
    db.info(function(err, info) {
      console && console.debug(err, info);
      if (err){
        dfr.rejectWith(err);
      } else {
        dfr.resolveWith(info);
      }
    });

    dfr.done(function(resp){
      console && console.log("RESP", resp);
      this.setState({progress: 55, bsStyle: "success", title: "Connected. Fetching config..."});
      var fetch_dfr = $.Deferred();
      fetch_dfr.done(function(){
        console && console.log(arguments);
        this.setState({progress: 100, title: "Success. Redirecting"});
        this.navigate("/")
      }.bind(this));

      var x = config.fetch({success: function() {console.log(arguments); fetch_dfr.resolve()},
                   error: function() {console.log(arguments); fetch_dfr.reject()}});
      console.log(x);
      return fetch_dfr;

    }.bind(this));

    dfr.fail(function(err){
      this.setState({progress: 100, error:err, bsStyle: "danger",  title: "Login failed."})
    }.bind(this));

  },
  getInitialState: function(){
    return {bsStyle: "info", progress: 10, title: "Logging in"}
  },
  render: function(){
    return (<div><ProgressBar active
                now={this.state.progress}
                bsStyle={this.state.bsStyle}
                label={this.state.title} /></div>)
  }
});

var MainApp = React.createClass({
  render: function(){
    return (<Locations hash>
              <Location path="/login/:key" handler={LoginHandler} />
              <Location path="/login" handler={LoginHandler} />
              <Location path="/*" handler={Configurator} />
            </Locations>)
  }
});

React.render(<MainApp />, document.getElementById('content')); // jshint ignore:line
// module.exports = MainApp;
