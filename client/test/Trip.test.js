import Trip from '../src/components/Atlas/Trip';

import { LOG } from "../src/utils/constants";
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

const places =
	[
			{
  		  "name": "Lake Mackay",
  		  "latitude": "-22.33",
  		  "longitude": "128.71"
  	  },
  	  {
  		  "name": "Lake Woods",
  		  "latitude": "-17.84",
  		  "longitude": "133.47"
  	  },
  	  {
  			 "name": "Lake Cowal",
    		 "latitude": "-33.63",
    		 "longitude": "147.45"
      }
  ];

  const distances = [704, 2241, 2222];

function mockTripResponse() {
  mock.onPost().reply(200,
    {
        "requestVersion": 3,
        "requestType": "trip",
        "options": {
          "earthRadius": "6371",
          "units": "km"
        },
        "places": places,
        "distances": distances
    });
}

async function testTripPlacesUnaltered() {
	mockTripResponse();
	var trip = new Trip(places);
	await trip.sendTripRequest();
	expect(trip.getTrip().places).toEqual(places);
}

test("Testing to confirm list of places returns unaltered", testTripPlacesUnaltered);


async function testTripDistance() {
	mockTripResponse();
	var trip = new Trip(places);
	await trip.sendTripRequest();
	expect(trip.getTrip().distances).toEqual(distances);
}

test("Testing for correct Trip distance response", testTripDistance);


async function testDefaultUnits() {
	mockTripResponse();
	var trip = new Trip(places);
	await trip.sendTripRequest();
	expect(trip.getTrip().options.units).toEqual("km");
}

test("Testing for correct default units within Trip", testDefaultUnits);


async function testDefaultEarthRadius() {
	mockTripResponse();
	var trip = new Trip(places);
	await trip.sendTripRequest();
	expect(trip.getTrip().options.earthRadius).toEqual("6371");
}

test("Testing for correct default earth Radius within Trip", testDefaultEarthRadius);


