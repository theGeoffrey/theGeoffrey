/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    rtbs = require('react-bootstrap'),
    Input = rtbs.Input;
    Label = rtbs.Label
    Button = rtbs.Button;


var ContactForm = React.createClass({

	submitForm: function(e) {
		e.preventDefault();
    	var fname = this.refs.fname.getDOMNode().value.trim();
    	var lname = this.refs.lname.getDOMNode().value.trim();
    	var email = this.refs.email.getDOMNode().value.trim();
    	var text = this.refs.text.getDOMNode().value.trim();
    	var phone = this.refs.phone.getDOMNode().value.trim();
    	if (!fname) {
      		return;
    	}
    	// TODO: send request to the server
    	this.refs.fname.getDOMNode().value = '';
    	this.refs.lname.getDOMNode().value = '';
    	this.refs.email.getDOMNode().value = '';
    	this.refs.text.getDOMNode().value = '';
    	this.refs.phone.getDOMNode().value = '';
    	return;
	},

	render: function() {
    return (
      <form className="form-horizontal forms-app">
         <h2>Contact</h2>
        <Input type="text" className="form-text" placeholder="Your first name" label="First name:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="fname"/>
        <Input type="text" className="form-text" placeholder="Your last name" label="Last name:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="lname"/>
         <Input type="text" className="form-text" placeholder="name@email.com" label="E-mail:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="email"/>
         <Input type="text" className="form-text" placeholder="Phone number" label="Phone number:" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="phone"/>
        <Input type="textarea" className="form-textarea" placeholder="Ask your question, or post your message" label="Message:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="text"/>
       <button className="btn btn-primary form-button" type="Post">Submit</button>
      </form>
    );
  }
});

module.exports = ContactForm;