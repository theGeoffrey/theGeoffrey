/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    rtbs = require('react-bootstrap'),
    Input = rtbs.Input;
    Label = rtbs.Label
    Button = rtbs.Button;


var FeedbackForm = React.createClass({

	submitForm: function(e) {
		e.preventDefault();
    	var fname = this.refs.fname.getDOMNode().value.trim();
    	var lname = this.refs.lname.getDOMNode().value.trim();
    	var email = this.refs.email.getDOMNode().value.trim();
    	var text = this.refs.text.getDOMNode().value.trim();
    	if (!text || !fname) {
      		return;
    	}
    	// TODO: send request to the server
    	this.refs.fname.getDOMNode().value = '';
    	this.refs.lname.getDOMNode().value = '';
    	this.refs.email.getDOMNode().value = '';
    	this.refs.text.getDOMNode().value = '';
    	return;
	},

	render: function() {
    return (
      <form className="form-horizontal forms-app">
         <h2>Feedback</h2>
        <Input type="text" className="form-text" placeholder="Your first name" label="First name:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="fname"/>
        <Input type="text" className="form-text" placeholder="Your last name" label="Last name:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="lname"/>
         <Input type="text" className="form-text" placeholder="Your email" label="E-mail:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="email"/>
        <Input type="textarea" className="form-textarea" placeholder="We would love to have your feedback..." label="Feedback:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="text"/>
       <button className="btn btn-primary form-button" type="Post">Submits</button>
      </form>
    );
  }
});

module.exports = FeedbackForm;