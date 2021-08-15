import { LOG } from "../src/utils/constants";
import HttpResponse from "../src/components/HttpResponse";
import './jestConfig/enzyme.config.js'
import {mount, shallow} from 'enzyme'

var serverResponse = {
    status: null,
};

function testRequestSuccessful200() {
    serverResponse.status = 200;
    var httpResponse = new HttpResponse(serverResponse);
    expect(httpResponse.getServerStatusString()).toEqual("Status 200: Server request successful");
    expect(httpResponse.getServerErrorStatus()).toEqual(false);
}
test("Verify receive status 200 and errorStatus: false", testRequestSuccessful200);

function testInvalidClientRequest400() {
    serverResponse.status = 400;
    var httpResponse = new HttpResponse(serverResponse);
    expect(httpResponse.getServerStatusString()).toEqual("Error 400: Invalid request from client");
    expect(httpResponse.getServerErrorStatus()).toEqual(true);
}
test("Verify receive status 400 and errorStatus: true", testInvalidClientRequest400);

function testInternalServerError500() {
    serverResponse.status = 500;
    var httpResponse = new HttpResponse(serverResponse);
    expect(httpResponse.getServerStatusString()).toEqual("Error 500: Internal Server Error");
    expect(httpResponse.getServerErrorStatus()).toEqual(true);
}
test("Verify receive status 500 and errorStatus: true", testInternalServerError500);

function testUnknownResponseError() {
    serverResponse.status = null;
    var httpResponse = new HttpResponse(serverResponse);
    expect(httpResponse.getServerStatusString()).toEqual("Unknown response status from the server");
    expect(httpResponse.getServerErrorStatus()).toEqual(true);
}
test("Verify receive status unknown and errorStatus: true", testUnknownResponseError);