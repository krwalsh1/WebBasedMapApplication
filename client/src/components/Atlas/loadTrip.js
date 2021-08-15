import { LOG } from "../../utils/constants";
import { isJsonResponseValid } from "../../utils/restfulAPI";
import * as tripFileSchema from "../../../schemas/TripFile";

export async function loadTrip(loadedTripFile) {

	var loadedTrip;

	var fileReader = new FileReader();
	fileReader.readAsText(loadedTripFile);

	fileReader.onerror = function() {
    LOG.error(fileReader.error);
  };

	fileReader.onload = async function() {
	  var dataJSON = JSON.parse(fileReader.result);
      if (isJsonResponseValid(dataJSON, tripFileSchema)) {
        LOG.info("Valid JSON trip file: \n");
        LOG.info(dataJSON);
        loadedTrip = parseData(dataJSON);
      }
      else {
        LOG.error("Invalid JSON trip file");
      }
  };
  return new Promise(function(resolve) {
    setTimeout(function(){
      resolve(loadedTrip)
    }, 200);
  });

}


function parseData(data) {
	var loadedTrip = {
		title: undefined,
		units: undefined,
		earthRadius: undefined,
		response: "0.0",
		places: data.places
	};

	for (var prop in data.options) {
		if (prop == "title") {
			loadedTrip.title = data.options[prop];
		}
		else if(prop == "units") {
			loadedTrip.units = data.options[prop];
		}
		else if (prop == "earthRadius") {
			loadedTrip.earthRadius = data.options[prop];
		}
		else if (prop == "response") {
			loadedTrip.response = data.options[prop];
		}
	}
	return loadedTrip;
}

