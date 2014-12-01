/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    SimpleAppMixin = require('./_mixin');
    Router = require('react-router-component');

var Forms = React.createClass({
  _key: 'forms',
  _sync_keys: ['form_type', 'category', 'form_key', 'title', 'template', 'post_message'],
  _services: ['post_form'],
  _name: "Forms",
  mixins: [SimpleAppMixin],
  _render: function(){
    return(
        <form onSubmit={this._defaultFormSubmit}>
          <div className="form-group">
             <label for="formKey">Form key</label>
             <input type="text" className="form-control" id="formKey" value={this.state.form_key}  placeholder="Enter Form Key" ref="form_key" />
          </div>
          <div className="form-group">
             <label for="category">Post form data to category:</label>
             <input type="text" className="form-control" id="category" value={this.state.category}  placeholder="Category name" ref="category" />
          </div>
          <div className="form-group">
           <label for="formType">Form type</label>
            <select className="form-control" value={this.state.form_type}>
              <option value="Contact">Contact</option>
              <option value="Feedback">Feedback</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className="form-group">
             <label for="title">Title</label>
             <input type="text" className="form-control" id="title" value={this.state.title}  placeholder="Title" ref="title" />
          </div>
          <div className="form-group">
             <label for="template">Template</label>
             <textarea className="form-control" id="template" value={this.state.template}  placeholder="Create your form in moustache" ref="template" />
             <span id="helpBlock" className="help-block">Create your own template with Moustache, or use one of our default templates.</span>
          </div>
          <div className="form-group">
             <label for="postMessage">Message for user:</label>
             <textarea className="form-control" id="postMessage" value={this.state.post_message}  placeholder="Message that will be send to user once form has been posted" ref="post_message" />
          </div> 
          <div className="checkbox">
          <label>
            <input type="checkbox"
                   defaultChecked={this.state.post_form}
                   ref="post_form" />
                   Post form data to Discourse in a new topic
          </label>
          </div>   
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
    );
  }
});

module.exports = Forms;