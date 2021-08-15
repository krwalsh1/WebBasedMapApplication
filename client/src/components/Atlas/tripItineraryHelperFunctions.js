import {Table, Input, Button} from 'reactstrap';
import React from 'react';
import Select from 'react-select';
import { LOG } from "../../utils/constants";
import FileDownload from "./FileDownload";

var placeInfo = [];
var lastEntry = "";
var reversedLocal = false;

export function buildTripTable(tripItinerary, tripCreated, tripEnabled, info, isFromFile, isReversed) {
	if(tripCreated && tripEnabled) {
		var newFileDownload = new FileDownload(tripItinerary);
		var units = "units";
		var title = "New Trip";
		if (tripItinerary.options.units) {
			var units = tripItinerary.options.units;
		}
		if (tripItinerary.options.title) {
			var title = tripItinerary.options.title;
		}

		placeInfo = buildPlaceInfo(tripItinerary, info, isFromFile);
		if (isReversed != reversedLocal){
        	reversedLocal = isReversed;
        	placeInfo = placeInfo.reverse();
        }
		LOG.info(info);
		LOG.info(placeInfo);
		return renderTable(units, title, newFileDownload, placeInfo);
	}
}

function buildPlaceInfo(tripItinerary, info, isFromFile) {
  if (info != "" && info != lastEntry){
		placeInfo.push(info);
    lastEntry = info;
  }
  if (placeInfo.length == 0 || isFromFile){
    placeInfo = [];
    for (var i = 0; i < tripItinerary.places.length; i++){
      placeInfo.push("");
    }
  }
	return placeInfo;
}

function renderTable(units, title, newFileDownload, placeInfo) {
		const options = [{value: 'application/json', label: '.json'}, {value: "text/csv", label: '.csv'}, {value: 'image/svg+xml', label: '.svg'}, {value: 'application/vnd.google-earth.kml+xml', label: '.kml'}];
		return (
			<Table bordered hover size="sm" className="dynamicText" responsive>
				<thead className="text-center">
				<tr>
					<th colSpan={6}><Input type="text" placeholder={title} onChange={newFileDownload.nameChange} className="text-center"/></th>
				</tr>
				<tr>
					<th colSpan={2} className="align-middle">
        	  <Button onClick={() => newFileDownload.fileExtension ? newFileDownload.downloadFile() : alert("Please select a file type")} size="sm" block color={'secondary'}>Save File</Button>
        	</th>
        	<th colSpan={4} className="align-middle"><Select onChange={newFileDownload.changeFileExtension} options={options} placeholder="File Format"/></th>
				</tr>
				<tr>
					<th>Leg #</th>
					<th>Source</th>
					<th>Destination</th>
					<th>{"Distance (" + units + ")"}</th>
					<th>{"Cumulative Distance (" + units + ")"}</th>
					<th>Notes</th>
				</tr>
				</thead>
				{buildRow(newFileDownload.tripItinerary, placeInfo)}
			</Table>
		);
}

function buildRow(tripItinerary, placeInfo) {
	var distanceCumulative = 0;
	var tableData = [];
	for (var legNumber = 0; legNumber < tripItinerary.places.length; legNumber++) {
		distanceCumulative = distanceCumulative + parseFloat(tripItinerary.distances[legNumber]);
		var legNumberPlusOne = legNumber + 1;
		if (legNumberPlusOne === tripItinerary.places.length) {
			legNumberPlusOne = 0;
  	}
		tableData.push(displayRow(
    	legNumberPlusOne,
    	tripItinerary.places[legNumber].name + "\n" + placeInfo[legNumber].substring(placeInfo[legNumber].indexOf("- ")),
    	tripItinerary.places[legNumberPlusOne].name + "\n" + placeInfo[legNumberPlusOne].substring(placeInfo[legNumberPlusOne].indexOf("- ")),
    	tripItinerary.distances[legNumber],
    	distanceCumulative,
      tripItinerary.places[legNumber].notes ? tripItinerary.places[legNumber].notes : ""
    ));
	}
	return tableData;
}

function displayRow(legNumber, source, destination, distance, distanceCumulative, notes) {
	return (
    <tbody className="text-right">
      <tr>
        <th className="text-center" scope="row">{legNumber}</th>
        <td>{source}</td>
        <td>{destination}</td>
        <td>{distance}</td>
        <td>{distanceCumulative}</td>
		<td><Input style={{display: "flex"}} defaultValue={notes} placeholder="Notes for destination"/></td>
      </tr>
    </tbody>
  );
}

