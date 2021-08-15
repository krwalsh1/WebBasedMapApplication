import Coordinates from 'coordinate-parser';
import { LOG } from "../../utils/constants";

export default class CoordinateConverter {
	constructor(lat, long) {
		this.latInput = lat;
		this.longInput = long;
		this.checkValidCoordinates(lat, long);
	}

	checkValidCoordinates(lat, long) {
		var errorMessage = "";
		// isValidPosition requires a full coordinate. Will not work with just lat or long
		if (!this.isValidPosition(lat + ", 0")) {
			errorMessage = "Invalid latitude '" + lat + "' within " +
        "coordinates: '(" + lat + ", " + long + ")'";
      LOG.error(errorMessage);
			throw errorMessage;
		}
		// isValidPosition requires a full coordinate. Will not work with just lat or long
		if (!this.isValidPosition("0, " + long)) {
			errorMessage = "Invalid longitude '" + long + "' within " +
        "coordinates: '(" + lat + ", " + long + ")'";
      LOG.error(errorMessage);
			throw errorMessage;
    }
		return;
	}

	isValidPosition(coordinates) {
    try {
      new Coordinates(coordinates);
      return true;
    } catch (error) {
      return false;
    }
  }

  coordinateToDecimal() {
    var positionDecimal = new Coordinates(this.latInput + " " + this.longInput);
    return [String(positionDecimal.getLatitude()), String(positionDecimal.getLongitude())];
  }

  getOriginalCoordinates() {
    return [this.latInput, this.longInput];
  }
}
