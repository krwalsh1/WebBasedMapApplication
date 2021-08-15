import Distance from '../src/components/Atlas/Distance';

import { LOG } from "../src/utils/constants";
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

const place1 =
			{
  		  "name": "Lake Mackay",
  		  "latitude": "-22.33",
  		  "longitude": "128.71"
  	  };
const place2 =
  	  {
  			 "name": "Lake Cowal",
    		 "latitude": "-33.63",
    		 "longitude": "147.45"
      };

const distanceBetween = 2222;

function mockDistanceResponse() {
  mock.onPost().reply(200,
    {
        "requestVersion": 4,
        "requestType": "distance",
        "earthRadius": 6371,
        "place1": place1,
        "place2": place2,
        "distance": distanceBetween
    });
}

async function testDistancePlacesUnaltered() {
	mockDistanceResponse();
	var distance = new Distance(place1, place2);
	await distance.sendDistanceRequest();
	expect(distance.getDistance().place1).toEqual(place1);
	expect(distance.getDistance().place2).toEqual(place2);

}

test("Testing to confirm places return unaltered", testDistancePlacesUnaltered);



async function testDistance() {
	mockDistanceResponse();
	var distance = new Distance(place1, place2);
	await distance.sendDistanceRequest();
	expect(distance.getDistance().distance).toEqual(distanceBetween);
}

test("Testing for correct distance response", testDistance);


async function testDefaultEarthRadius() {
	mockDistanceResponse();
	var distance = new Distance(place1, place2);
	await distance.sendDistanceRequest();
	expect(distance.getDistance().earthRadius).toEqual(6371);
}

test("Testing for correct default earth Radius within Distance request", testDefaultEarthRadius);

