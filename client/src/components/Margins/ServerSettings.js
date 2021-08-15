import React, { Component } from "react";
import { Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import Select from "react-select";

import {sendServerRequest, isJsonResponseValid, getOriginalServerPort} from "../../utils/restfulAPI";

import * as configSchema from "../../../schemas/ResponseConfig";
import HttpResponse from "./../HttpResponse";

export default class ServerSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputText: this.props.serverSettings.serverPort,
            validServer: null,
            config: {},
        };

        this.saveInputText = this.state.inputText;
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                    <ModalHeader toggle={() => this.props.toggleOpen()}>Server Connection</ModalHeader>
                    {this.renderSettings(this.getCurrentServerName())}
                    {this.renderActions()}
                </Modal>
            </div>
        );
    }

    renderSettings(currentServerName) {
        return (
            <ModalBody>
                <Row className="m-2">
                    <Col>Name: {currentServerName}</Col>
                </Row>
                <Row className="m-2">
                    <Col className="mt-2 col-1">URL:</Col>
                    <Col className= "pl-4 pl-sm-4 col-auto">{this.renderInputField()}</Col>
                </Row>
                <Row className="m-2">
                    <Col>Request Type: {this.getCurrentRequestType().requestType}</Col>
                </Row>
                <Row className="m-2">
                    <Col>Request Version: {this.getCurrentRequestType().requestVersion}</Col>
                </Row>
                <Row className="m-2">
                    <Col>
                        Valid Filters:
                        <Select placeholder="Country Filters" options={this.getValidFilters().where}/>
                        <Select placeholder="Type Filters" options={this.getValidFilters().type}/>
                    </Col>
                </Row>
            </ModalBody>
        );
    }

    renderInputField() {
        let valid = this.state.validServer === null ? false : this.state.validServer;
        let notValid = this.state.validServer === null ? false : !this.state.validServer;
        return(
            <Input onChange={(e) => this.updateInput(e.target.value)}
                   value={this.state.inputText}
                   placeholder={this.props.serverPort}
                   valid={valid}
                   invalid={notValid}
            />
        );
    }

    renderActions() {
        return (
            <ModalFooter>
                <Button color="primary" onClick={() => this.resetServerSettingsState()}>Cancel</Button>
                <Button color="primary" onClick={() =>
                {
                    this.props.processServerConfigSuccess(this.state.config, this.state.inputText);
                    this.resetServerSettingsState(this.state.inputText);
                }}
                        disabled={!this.state.validServer}
                >
                    Save
                </Button>
            </ModalFooter>
        );
    }

    getCurrentServerName() {
        let currentServerName = this.getRequestParameter("serverName", "serverConfig");
        if (this.state.config && Object.keys(this.state.config).length > 0) {
            currentServerName = this.state.config.serverName;
        }
        return currentServerName;
    }

    getCurrentRequestType() {
        let currentRequestType = this.getRequestParameter("requestType", "serverConfig");
        let currentRequestVersion = this.getRequestParameter("requestVersion", "serverConfig");
        return {"requestType": currentRequestType, "requestVersion": currentRequestVersion};
    }

    getRequestParameter(requestParameter, serverSettingType) {
      return (this.props.serverSettings[serverSettingType] && this.state.validServer === null ? this.props.serverSettings[serverSettingType][requestParameter]: "");
    }

    getValidFilters() {
         let whereFilters = this.getRequestParameter("where", "filters");
         let typeFilters = this.getRequestParameter("type", "filters");
         let stringWhereFilters = this.filterStringBuilder(whereFilters);
         let stringTypeFilters = this.filterStringBuilder(typeFilters);
         return {"where": stringWhereFilters, "type": stringTypeFilters};
    }

    filterStringBuilder(filterArray) {
      let filterString = [];
      let place = 0;
      let jsonString = "";
      for(var i in filterArray) {
        jsonString = '{"value": ' + place + ', "label": ' + JSON.stringify(filterArray[place]) + ', "isDisabled": ' + true + '}';
        filterString.push(JSON.parse(jsonString));
        place++;
      }
      return filterString;
    }

    updateInput(value) {
        this.setState({inputText: value}, () => {
            if (this.shouldAttemptConfigRequest(value)) {
                sendServerRequest({requestType: "config", requestVersion: 4}, value)
                    .then(config => {
                        var httpResponse = new HttpResponse(config);
                        if (!httpResponse.getServerErrorStatus()) { this.processConfigResponse(httpResponse.getServerResponse().data); }
                        else { this.setState({validServer: true, config: httpResponse.getServerResponse()}); }
                    });
            } else {
                this.setState({validServer: false, config: {}});
            }
        });
    }

    shouldAttemptConfigRequest(resource) {
        const urlRegex = /https?:\/\/.+/;
        return resource.match(urlRegex) !== null && resource.length > 15;
    }

    processConfigResponse(config) {
        if(!isJsonResponseValid(config, configSchema)) {
            this.setState({validServer: false, config: false});
        } else {
            this.setState({validServer: true, config: config});
        }
    }

    resetServerSettingsState(inputText=this.saveInputText) {
        this.props.toggleOpen();
        this.setState({
            inputText: inputText,
            validServer: null,
            config: false
        });
    }
}
