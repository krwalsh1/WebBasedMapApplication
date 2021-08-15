import { LOG } from "../../utils/constants";
import * as tripSchema from "../../../schemas/TripResponse";
import { sendServerRequest } from "../../utils/restfulAPI";
import {processServerResponse} from "./processServerResponse"
import Atlas from './Atlas';

import React, { createRef, Component} from 'react';


export default class Trip extends Component {
	constructor(title = "New Trip", units = "km", earthRadius = "6371", response = "0.0", tripPlaces) {
		super(tripPlaces, units, earthRadius, response, tripPlaces);
		this.trip;
		this.title = title;
		this.tripUnits = units;
		this.earthRadius = earthRadius;
		this.response = response;
		this.tripPlacesInput = tripPlaces;
	}

	async sendTripRequest() {
		await sendServerRequest({requestType: "trip", requestVersion: 4, places: this.tripPlacesInput, options: {earthRadius: this.earthRadius, units: this.tripUnits, response: this.response, title: this.title}})
      .then(tripResponse => {
        this.trip = processServerResponse(tripResponse, tripSchema)
      });
  }

	getTrip() {
		return this.trip;
	}

}