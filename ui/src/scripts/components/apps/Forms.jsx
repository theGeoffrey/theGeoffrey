/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    _ = require('underscore'),
    updateConfig = require('../../actions/Config').updateConfig,
    SimpleAppMixin = require('./_mixin'),
    Router = require('react-router-component'),
    rtbs = require('react-bootstrap'),
    Panel = rtbs.Panel,
    Accordion = rtbs.Accordion,
    Input = rtbs.Input,
    Button = rtbs.Button,
    Modal = rtbs.Modal,
    OverlayMixin = rtbs.OverlayMixin,
    CONFIG = require('../../stores/Config'),
    F_KEY = 'forms';

var FORM_TEMPLATES = {'Feedback': '**Contact Form: {{#title}} \nName: {{#name}} \nEmail: {{#email}} \nFeedback: {{#text}}',
                      'Contact': '**Contact Form: {{#title}} \nName: {{#name}} \nEmail: {{#email}} \nMessage: {{#text}}',
                      'Support': '**Support Form: {{#title}} \nName: {{#name}} \nEmail: {{#email}} \nQuestion: {{#text}}',
                      'Custom': 'Create your own form.'
                    };

var SingleForm = React.createClass({
  mixins: [_.pick(SimpleAppMixin, '_get_form_data'), OverlayMixin],
  _sync_keys: ['form_type', 'category', 'form_key', 'title', 'template', 'post_message'],
  
  saveForm: function(){
    var forms_list = CONFIG.attributes[F_KEY] || [];
    forms_list[this.props.index] = this._get_form_data();
    updateConfig({forms: forms_list});
    return false;
  },

  saveNewForm: function(){
    var forms_list = CONFIG.attributes[F_KEY] || [];
    forms_list.push(this._get_form_data())
    updateConfig({forms: forms_list});
    return false;
  },

   getInitialState: function() {
    return {"tmpl" : FORM_TEMPLATES[this.props.form_data.form_type],
            "ftype" : this.props.form_data.form_type,
            isModalOpen: false};
  },

  updateFormType: function(event){
    this.setState({"tmpl" : FORM_TEMPLATES[event.target.value],
                   "ftype" : event.target.value});
  },

  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  render: function(){
    var saveCb = this.props.saveNew ? this.saveNewForm : this.saveForm;
    var fixedTmpl = (<Input type='textarea' label="Template:" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
                      help="Create your own template in Mustache, or select an existing one" 
                      value={this.state.tmpl}  placeholder="Create your form in mustache" ref="template" />);
    var customTmpl = (<Input type='textarea' label="Template:" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
                      help="Create your own template in Mustache, or select an existing one" 
                      defaultValue={this.state.tmpl}  placeholder="Create your form in mustache" ref="template" />);
    var selectTmpl = this.state.ftype === 'Custom' ? customTmpl : fixedTmpl;
    var disabledButton =  <Button className="btn btn-primary btn-form" onClick={this.handleToggle} bsStyle="primary" disabled>Embed Form</Button>;
    var activeButton =  <Button className="btn btn-primary btn-form" onClick={this.handleToggle} bsStyle="primary">Embed Form</Button>;
    var embedButton = this.state.ftype === 'Custom' ? disabledButton : activeButton;
    
    return(
        <form onSubmit={saveCb} className="forms-form form-horizontal">
          <Input type="text" label="Form key:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" defaultValue={this.props.form_data.form_key}  
                    placeholder="Enter Form Key" ref="form_key" />
          <Input type="text" label="Discourse Category:" labelClassName="col-xs-2" 
                    wrapperClassName="col-xs-10" defaultValue={this.props.form_data.category}  
                    placeholder="Category name" ref="category" />
         
          <Input type='select' onChange={this.updateFormType} defaultValue={this.props.form_data.form_type} 
                    label="Form Type:" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref='form_type'>
            <option value="Contact">Contact</option>
            <option value="Feedback">Feedback</option>
            <option value="Support">Support</option>
            <option value="Custom">Custom</option>
          </Input>
 
          <Input type="text" label="Title:" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
                      defaultValue={this.props.form_data.title}  placeholder="Title" ref="title" />
          
          {selectTmpl}
          
          <Input type='textarea' label="Message for user:" labelClassName="col-xs-2" 
                      wrapperClassName="col-xs-10" defaultValue={this.props.form_data.post_message}  
                      placeholder="Message that will be send to user once form has been posted" ref="post_message" /> 
          
          <button className="btn btn-primary btn-form" type="submit">Save</button>
          {embedButton}
        </form>
    );
  },

  renderOverlay: function () {
    var framestyle = {textAlign: 'center'};
    
    var frame_url;
    var link_url;

    if (this.state.ftype === 'Contact') {
      frame_url = "../forms.html#/contact";
      link_url = "<iframe width='560' height='400' src='http://localhost:8000/apps/forms/contact' frameborder='0' allowfullscreen></iframe>";
    }

    else if (this.state.ftype === 'Feedback'){
      frame_url = "../forms.html#/feedback";
      link_url = "<iframe width='560' height='400' src='http://localhost:8000/apps/forms/feedback' frameborder='0' allowfullscreen></iframe>";
    }
    else if (this.state.ftype === 'Support'){
      frame_url = "../forms.html#/support";
      link_url = "<iframe width='560' height='400' src='http://localhost:8000/apps/forms/support' frameborder='0' allowfullscreen></iframe>";
    };

    if (!this.state.isModalOpen || this.state.ftype == 'Custom') {
      return <span/>;
    }

    return (
        <Modal title="Copy the link below to embed the form!" onRequestHide={this.handleToggle}>
          <div style={framestyle}>
          <iframe width="560" height="400" src={frame_url} frameBorder="0" allowFullScreen></iframe>
          </div>
          <div className="modal-footer">
            <Input type = 'text' value={link_url} />
            <button className="btn btn-primary" onClick={this.handleToggle}>Close</button>
          </div>
        </Modal>
      );
  }
});

var Forms = React.createClass({
  _key: F_KEY,
  _name: "Forms",
  mixins: [_.omit(SimpleAppMixin, '_get_config')],
  _get_config: function(inp){
    return {"forms_list": CONFIG.attributes[this._key] || []};
  },
  _render: function(){
    var empty_form = {'form_type': 'Contact',
                      'form_key': '',
                      'category': '',
                      'template': '',
                      'title': '',
                      'post_message': ''}
    var new_hdr = (<h3> + Add Form</h3>);
    var saveNew = true
    return(
      <div>
        <Accordion>      
            {_.map(this.state.forms_list, function(form_data, index){
              
              var hdr_str = form_data.form_type+ ' form: ' + form_data.title;
              var hdr = (<h3>{hdr_str}</h3>);
              
              return(
                <Panel header={hdr} bsStyle='info' eventKey={index}>
                  <SingleForm form_data={form_data} index={index} />
                </Panel>)
            })}
            <Panel header={new_hdr} bsStyle='warning' eventKey={this.state.forms_list.length}>
              <SingleForm form_data={empty_form} saveNew={saveNew} />
            </Panel>
        </Accordion>
        </div>
        )}
});

module.exports = Forms;