/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    rtbs = require('react-bootstrap'),
    Input = rtbs.Input;
    Label = rtbs.Label
    Button = rtbs.Button;


var SupportForm = React.createClass({

	submitForm: function(e) {
		e.preventDefault();
    	var fname = this.refs.fname.getDOMNode().value.trim();
    	var email = this.refs.email.getDOMNode().value.trim();
    	var text = this.refs.text.getDOMNode().value.trim();
    	if (!text || !fname) {
      		return;
    	}
    	// TODO: send request to the server
    	this.refs.fname.getDOMNode().value = '';
    	this.refs.email.getDOMNode().value = '';
    	this.refs.text.getDOMNode().value = '';
    	return;
	},

	render: function() {
    return (
      <form className="form-horizontal forms-app">
         <h2>Support</h2>
        <Input type="text" className="form-text" placeholder="Your name" label="Name:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="fname"/>
         <Input type="text" className="form-text" placeholder="Your email" label="E-mail:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="email"/>
        <Input type="textarea" className="form-textarea" placeholder="How may we help you?" label="Question:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" ref="text"/>
       <button className="btn btn-primary form-button" type="Post">Submit</button>
      </form>
    );
  }
});

module.exports = SupportForm;