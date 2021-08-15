import './jestConfig/enzyme.config';
import React from 'react';

import FileDownload from '../src/components/Atlas/FileDownload';
import {baseMap} from "../src/components/Atlas/baseMap";
import {baseKML} from "../src/components/Atlas/baseKML";

let trip1 = "";

// const trip2 = {
//     "requestType": "trip",
//     "requestVersion": 4,
//     "options": {"title":"Shopping Loop", "earthRadius":"3959.0", "units":"miles"},
//     "places": [{"name":"Denver", "latitude": "39.7", "longitude": "-105.0", "notes":"The big city"},
//         {"name":"Boulder", "latitude": "40.0", "longitude": "-105.4", "notes":"Home of CU"},
//         {"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1", "notes":"Home of CSU"}],
//     "distances": [20, 40, 50]
// }

function testTripTitleChange() {
		resetTrip();
    let expectedTitle = "Trip XYZ";
    var newFileDownload = new FileDownload(trip1);
    const mockEvent = {target: {value: expectedTitle}};
    newFileDownload.nameChange(mockEvent);
    expect(newFileDownload.tripItinerary.options.title).toEqual(expectedTitle);
}
test("Testing trip title change", testTripTitleChange);

function testTripUnitChange() {
		resetTrip();
    let expectedUnits = "m";
    var newFileDownload = new FileDownload(trip1);
    newFileDownload.unitChange(expectedUnits);
    expect(newFileDownload.tripItinerary.options.units).toEqual(expectedUnits);
}
test("Testing trip unit change", testTripUnitChange);

function testTripFileExtensionChange() {
		resetTrip();
    let expectedFileExtension = ".csv";
    var newFileDownload = new FileDownload(trip1);
    const mockEvent = {label: ".csv"};
    newFileDownload.changeFileExtension(mockEvent);
    expect(newFileDownload.fileExtension).toEqual(expectedFileExtension);
}
test("Testing trip file extension change", testTripFileExtensionChange);

function testTripJSON() {
		resetTrip();
    let expectedText = "{\"requestType\":\"trip\",\"requestVersion\":4,\"options\":{\"title\":\"Shopping Loop\",\"earthRadius\":\"3959.0\",\"units\":\"miles\"}," +
                          "\"places\":[{\"name\":\"Denver\",\"latitude\":\"39.7\",\"longitude\":\"-105.0\"}," +
                          "{\"name\":\"Boulder\",\"latitude\":\"40.0\",\"longitude\":\"-105.4\"}," +
                          "{\"name\":\"Fort Collins\",\"latitude\":\"40.6\",\"longitude\":\"-105.1\"}]," +
                          "\"distances\":[20,40,50]}";
    var newFileDownload = new FileDownload(trip1);
    const mockEvent = {label: ".json"};
    newFileDownload.changeFileExtension(mockEvent);
    newFileDownload.buildFileText();
    expect(newFileDownload.fileText).toEqual(expectedText);
}
test("Testing JSON output", testTripJSON);

function resetTrip() {
	trip1 = {
              "requestType": "trip",
              "requestVersion": 4,
              "options": {"title":"Shopping Loop", "earthRadius":"3959.0", "units":"miles"},
              "places": [{"name":"Denver", "latitude": "39.7", "longitude": "-105.0"},
                          {"name":"Boulder", "latitude": "40.0", "longitude": "-105.4"},
                          {"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1"}],
              "distances": [20, 40, 50]
  };
}

function testTripCSV() {
    resetTrip();
    let expectedText = "Options,Title,Earth Radius,Units\n,Shopping Loop,3959.0,miles\nPlaces,Name,Latitude,Longitude\n" +
        ",Denver,39.7,-105.0\n,Boulder,40.0,-105.4\n,Fort Collins,40.6,-105.1\n" +
        "Distances,20,40,50";

    var newFileDownload = new FileDownload(trip1);
    const mockEvent = {label: ".csv"};
    newFileDownload.changeFileExtension(mockEvent);
    newFileDownload.buildFileText();
    expect(newFileDownload.fileText).toEqual(expectedText);;
}
test("Testing CSV output", testTripCSV);


// function testTripNotesCSV() {
//     let expectedText = "Options,Title,Earth Radius,Units\n,Shopping Loop,3959.0,miles\nPlaces,Name,Latitude,Longitude,Notes\n" +
//         ",Denver,39.7,-105.0,The big city\n,Boulder,40.0,-105.0,Home of CU\n,Fort Collins,40.6,-105.1,Home of CSU\n" +
//         "Distances,20,40,50";
//
//     let returnedText = makeCSV(trip2);
//
//     expect(returnedText).toEqual(expectedText);
// }
// test("Testing CSV text with notes is correct", testTripNotesCSV);

function testTripSVG() {
    resetTrip();
    let base = baseMap();
    let expectedText = base + "<line x1=\"-105.0\" y1=\"-39.7\" x2=\"-105.4\" y2=\"-40.0\" stroke=\"black\" stroke-width=\"1\"/>" +
        "<line x1=\"-105.4\" y1=\"-40.0\" x2=\"-105.1\" y2=\"-40.6\" stroke=\"black\" stroke-width=\"1\"/>" +
        "<line x1=\"-105.1\" y1=\"-40.6\" x2=\"-105.0\" y2=\"-39.7\" stroke=\"black\" stroke-width=\"1\"/>" +
        "</svg></svg>";
    var newFileDownload = new FileDownload(trip1);
    const mockEvent = {label: ".svg"};
    newFileDownload.changeFileExtension(mockEvent);
    newFileDownload.buildFileText();
    expect(newFileDownload.fileText).toEqual(expectedText);
}
test("Testing SVG output", testTripSVG);

function testTripSVGNegative(){
    let expectedTrip = {
        "requestType": "trip",
        "requestVersion": 4,
        "options": {"title":"Shopping Loop", "earthRadius":"3959.0", "units":"miles"},
        "places": [{"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1"},
            {"name":"Sydney", "latitude": "-33.856348", "longitude": "151.215340"}],
        "distances": [8345, 8345]
    };
    let base = baseMap();
    let expectedText = base + "<line x1=\"-105.1\" y1=\"-40.6\" x2=\"151.215340\" y2=\"33.856348\" stroke=\"black\" stroke-width=\"1\"/>" +
        "<line x1=\"151.215340\" y1=\"33.856348\" x2=\"-105.1\" y2=\"-40.6\" stroke=\"black\" stroke-width=\"1\"/>" +
        "</svg></svg>";
    var newFileDownload = new FileDownload(expectedTrip);
    const mockEvent = {label: ".svg"};
    newFileDownload.changeFileExtension(mockEvent);
    newFileDownload.buildFileText();
    expect(newFileDownload.fileText).toEqual(expectedText);
}
test("Testing SVG negative output", testTripSVGNegative);

function testTripKML(){
    resetTrip();
    let base = baseKML();
    let expectedText = base + "<Placemark>\n" +
        "  <name>Cross-corner line</name>\n" +
        "  <styleUrl>#CrossStyle</styleUrl>\n" +
        "  <LineString>\n" +
        "    <coordinates> -105.0,39.7,0\n" +
        "-105.4,40.0,0 </coordinates>\n" +
        "  </LineString>\n" +
        "</Placemark>" +
        "<Placemark>\n" +
        "  <name>Cross-corner line</name>\n" +
        "  <styleUrl>#CrossStyle</styleUrl>\n" +
        "  <LineString>\n" +
        "    <coordinates> -105.4,40.0,0\n" +
        "-105.1,40.6,0 </coordinates>\n" +
        "  </LineString>\n" +
        "</Placemark>"+
        "<Placemark>\n" +
        "  <name>Cross-corner line</name>\n" +
        "  <styleUrl>#CrossStyle</styleUrl>\n" +
        "  <LineString>\n" +
        "    <coordinates> -105.1,40.6,0\n" +
        "-105.0,39.7,0 </coordinates>\n" +
        "  </LineString>\n" +
        "</Placemark>"+
        "</Document>\n" +
        "</kml>";

    var newFileDownload = new FileDownload(trip1);
    const mockEvent = {label: ".kml"};
    newFileDownload.changeFileExtension(mockEvent);
    newFileDownload.buildFileText();
    expect(newFileDownload.fileText).toEqual(expectedText);;
}
test("Testing KML output", testTripKML);