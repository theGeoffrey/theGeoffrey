/** @jsx React.DOM */

'use strict';

var React = require('react/addons'),
    ReactBackboneMixin = require('backbone-react-component'),
    _helpers = require('./_helpers'),
    Config = require('../stores/Config'),
    rtbs = require('react-bootstrap'),
    Panel = rtbs.Panel,
    Accordion = rtbs.Accordion,
    PanelGroup = rtbs.PanelGroup,
    Input = rtbs.Input;


module.exports = React.createClass({
    mixins: [_helpers.configRerenderMixin],

    changePanelState: function (evt) {
        this.setState({'showFull' : !this.state.showFull});
    },

    getInitialState: function() {
        return {'showFull': false};
    },

    render: function () {
        var hdr = (<h3>Basic Configuration</h3>);
        var panel_key = (this.props.showFull || this.state.showFull) ? '1' : '0';
      return (
         <PanelGroup activeKey={panel_key} onClick={this.changePanelState} accordion>
            <Panel header={hdr} eventKey='1'>
                <form className='form-horizontal'>
                    <Input type="text" label="APP Key:" value={this.state.api_key} labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
                    <Input type="text" label="Public Key:" value={this.state.public_key} labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
                    <Input type="text" label="Discourse URL:" defaultValue={this.state.dc_url} placeholder="enter your discourse url" labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
                    <Input type="text" label="Discourse Username:" defaultValue={this.state.dc_username} placeholder="enter your discourse username" labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
                    <Input type="text" label="Discourse Api Key:" defaultValue={this.state.dc_api_key} placeholder="enter your discourse api key" labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
                </form>
            </Panel>
        </PanelGroup>
        );
    }
});