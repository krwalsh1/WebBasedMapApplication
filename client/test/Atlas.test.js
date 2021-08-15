import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';

import Atlas from '../src/components/Atlas/Atlas';
import {buildFilterList} from "../src/components/Atlas/FilterLists";
import GetMarker from "../src/components/Atlas/GetMarker";
import DrawLine from "../src/components/Atlas/DrawLine";
import TripDisplay from "../src/components/Atlas/TripDisplay.js";
import {Map} from "react-leaflet";

const startProperties = {
    createSnackBar: jest.fn()
};

function testInitialAtlasState() {

    const atlas = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    let actualMarkerPosition = atlas.state().markerPosition;
    let expectedMarkerPosition = null;

    expect(actualMarkerPosition).toEqual(expectedMarkerPosition);
}

test("Testing Atlas's Initial State", testInitialAtlasState);


function testMarkerIsRenderedOnClick() {

    const atlas = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    let actualMarkerPosition = atlas.state().markerPosition;
    let expectedMarkerPosition = null;

    expect(actualMarkerPosition).toEqual(expectedMarkerPosition);

    let latlng = {lat: 0, lng: 0};
    simulateOnClickEvent(atlas, {latlng: latlng});

    expect(atlas.state().markerPosition).toEqual(latlng);
    // expect(atlas.find('Marker')).toEqual(1); ??
}

function simulateOnClickEvent(reactWrapper, event) {
    reactWrapper.find('Map').at(0).simulate('click', event);
    reactWrapper.update();
}

test("Testing Atlas's Initial State", testMarkerIsRenderedOnClick);

function testFilterList() {
    const typeFilters = ["airport", "heliport", "balloonport"];
    const testTypes = [JSON.parse('{"label": "All Types","value": ' + 0 + ',"name": "_"}')];

    const returnedText = JSON.stringify(buildFilterList(testTypes, typeFilters));

    const expectedText = JSON.stringify([{"label": "All Types","value":0,"name": "_"},{"label": "airport","value":1,"name": "airport"},{"label": "heliport","value":2,"name": "heliport"},
        {"label": "balloonport","value":3,"name": "balloonport"}]);

    expect(returnedText).toEqual(expectedText);
}
test("Testing filter types", testFilterList);

async function testReverseGeo(){
    const atlas = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);
    let latLng = {lat: 40, lng: -105};
    simulateOnClickEvent(atlas, {latlng: latLng});
    expect(atlas.state().markerPosition.lat).toEqual(40);
    expect(atlas.state().markerPosition.lng).toEqual(-105);
    setTimeout(function(){
        expect(atlas.state().popupText.toString()).toEqual("Broomfield, Colorado. US.") //Gives the reverse-geolocation 0.6 seconds to come up with a response
    }, 600);
}
test("Testing reverse geolocation", testReverseGeo);

function testMarkerPlacement() {
    const markerlatlng = {lat: 0, lng: 0};
    const marker = shallow(<GetMarker markerPosition={markerlatlng} popupText={"0, 0"}/>);

    expect(marker.state().markerPosition).toEqual(markerlatlng);
    expect(marker.state().popupText).toEqual("0, 0");
}
test("Testing marker placement", testMarkerPlacement);

function testDrawLine() {
    const line1 = shallow(<DrawLine findDist={true} markerCurrentLocation={{lat: 0, lng: 0}} markerPosition={[0, 0]} dist={0} singleLocationTrip={[[0, 0], [0, 0]]}/>);
    const line2 = shallow(<DrawLine findDist={false} markerCurrentLocation={{lat: 0, lng: 0}} markerPosition={[0, 0]} dist={0} singleLocationTrip={[[0, 0], [0, 0]]}/>);

    expect(line1.state().dist).toEqual(0);
    expect(line2.state().dist).toEqual(0);
}
test("Testing line placement", testDrawLine);

function testManualAddedTrip() {
    let testAllMarkers = [[30, 140], [45, 155]];
    let manualTrip = shallow(<TripDisplay allTripMarkers={testAllMarkers} markerNames={["first location", "second location"]} initMarkerRef = {this.initMarkerRef} markerIcon={this.TRIP_MARKER_ICON} lineColor={"red"} tripLines={testAllMarkers} end={[testAllMarkers[0],testAllMarkers[1]]}/>);
    expect(manualTrip).toBeDefined();
}
test("Testing building a trip manually", testManualAddedTrip);

