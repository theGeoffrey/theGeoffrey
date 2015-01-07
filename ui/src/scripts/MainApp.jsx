/**
 * @jsx React.DOM
 */

'use strict';

require("./stores/_db.js");
require('oauth-js/dist/oauth.js');

var React = require('react/addons'),
    AppRouter = require('./components/Router'),
    Router = require('react-router-component'),
    MainDispatcher = require('./dispatchers/Main'),
    $ = require("jQuery"),
    Twbs = require('react-bootstrap'),
    Button = Twbs.Button,
    Well = Twbs.Well,
    Alert = Twbs.Alert,
    ProgressBar = Twbs.ProgressBar,
    Link = require('react-router-component').Link,
    setDB = require("./stores/_db.js").setDB,
    hasDB = require("./stores/_db.js").hasDB,
    Location = Router.Location,
    Locations = Router.Locations,
    config = Config = require('./stores/Config');
    OAuth = window.OAuth,
    MainConfig = require('./components/MainConfig');


// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

OAuth.initialize("2yGtmK5ys0mEOCBtSmI3VGA_c_A");

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
    return {'showFullConfig': true};
  },

  render: function() {
    return (<div>
              <MainConfig showFull={this.state.showFullConfig} />
              <AppRouter onNavigation={this.onNavigation} onBeforeNavigation={this.onBeforeNavigation}  />
            </div>);
  }
});

var LoginHandler = React.createClass({
  mixins: [Router.NavigatableMixin],
  componentDidMount: function(){

    var db = setDB(this.props.akey);
    this.setState({progress: 15});

    var dfr = $.Deferred();
    db.info(function(err, info) {
      console && console.debug(err, info);
      if (err){
        dfr.reject(err);
      } else {
        dfr.resolve(info);
      }
    });

    dfr.done(function(resp){
      this.setState({progress: 55, bsStyle: "success", title: "Connected. Fetching config..."});
      var fetch_dfr = $.Deferred();
      fetch_dfr.done(function(){
        this.setState({progress: 100, title: "Success. Redirecting"});
        this.navigate("/")
      }.bind(this));

      config.fetch({success: fetch_dfr.resolve, error: fetch_dfr.reject});

      return fetch_dfr;

    }.bind(this));

    dfr.fail(function(err){
      console.log(err);
      this.setState({progress: 100, err:err, bsStyle: "danger",  title: "Login failed."})
    }.bind(this));

  },
  getInitialState: function(){
    return {bsStyle: "info", err: false, progress: 10, title: "Logging in"}
  },
  render: function(){
    var post_text;

    if (this.state.err){
      post_text = (<Alert bsStyle="danger" >
                    <h4>{this.state.err.name}</h4>
                    <p>{this.state.err.message}</p>
                  </Alert>)

    }
    return (<Well bsSize="large"><ProgressBar active
                now={this.state.progress}
                bsStyle={this.state.bsStyle}
                label={this.state.title} />
                {post_text}
                </Well>)
  }
});

var EnsureLoginWrap = React.createClass({

  mixins: [Router.NavigatableMixin],
  componentWillMount: function(){
    console.log(this.getPath())
    if (!hasDB() && this.getPath().indexOf('/login') != 0) {
      console.log("leaving")
      this.navigate("#/login");
    }
  },

  render: function(){
    return (<Locations hash>
                <Location path="/login/:akey" handler={LoginHandler} />
                <Location path="/login" handler={LoginHandler} />
                <Location path="/*" handler={Configurator} />
            </Locations>)
  }

});

var MainApp = React.createClass({
  render: function(){

    var version = (<p>{window.GEOF_CONFIG.version}</p>),
        error;
    if (!window.GEOF_CONFIG.version){
      var error = (<div className="container">
                    <Alert bsStyle="danger" >
                      <h4>Connection to API Server failed</h4>
                      <p>please reload</p>
                    </Alert>
                  </div>)
    }
    return (<div>
              <div className='container geoff-title'>
                <Link href="/"><h1>theGeoffrey</h1></Link>
                {{version}}
              </div>
              {{error}}

              <div className='main container geoff-maincontainer'>
                <Locations hash>
                  <Location path="/*" handler={EnsureLoginWrap} />
                </Locations>
              </div>
            </div>)
  }
});

React.render(<MainApp />, document.getElementById('content')); // jshint ignore:line
// module.exports = MainApp;
