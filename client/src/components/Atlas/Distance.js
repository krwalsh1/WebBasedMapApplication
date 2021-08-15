import { LOG } from "../../utils/constants";
import * as distanceSchema from "../../../schemas/ResponseDistance";
import { isJsonResponseValid, sendServerRequest } from "../../utils/restfulAPI";
import HttpResponse from "../HttpResponse";
import {processServerResponse} from "./processServerResponse"
import Atlas from './Atlas';

import React, { createRef, Component} from 'react';


export default class Distance extends Component {
	constructor(place1, place2, earthRadius = 6371) {
		super(earthRadius, place1, place2);
		this.distance;
		this.earthRadius = earthRadius;
		this.place1 = place1;
		this.place2 = place2;
	}

	async sendDistanceRequest() {
		await sendServerRequest({requestType: "distance", requestVersion: 4, earthRadius: this.earthRadius, place1: this.place1, place2: this.place2})
      .then(distanceResponse => {
				this.distance = processServerResponse(distanceResponse, distanceSchema)
      });
  }

	getDistance() {
		return this.distance;
	}

}