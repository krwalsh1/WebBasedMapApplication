import CoordinateConverter from '../src/components/Atlas/CoordinateConverter';


function testValidCoordinateFormat() {
	var lat = "x";
	var long = "1.0";
	expect(() => new CoordinateConverter(lat, long)).toThrow(new Error("Invalid latitude '" +
    lat + "' within coordinates: '(" + lat + ", " + long + ")'"));
	var lat = "1.0";
	var long = "x";
	expect(() => new CoordinateConverter(lat, long)).toThrow(new Error("Invalid longitude '" +
    long + "' within coordinates: '(" + lat + ", " + long + ")'"));

}

test("Testing for valid coordinates", testValidCoordinateFormat);


function testCoordinateToDecimal() {
	var lat = "40.123° N";
	var long = "74.123° W";
	var position = new CoordinateConverter(lat, long);
	var decimalCoordinateArray = position.coordinateToDecimal();
	expect(decimalCoordinateArray[0]).toEqual("40.123");
	expect(decimalCoordinateArray[1]).toEqual("-74.123");
}

test("Testing coordinate to decimal conversion", testCoordinateToDecimal);

function testgetOriginalCOordinates() {
	var lat = "40.123° N";
	var long = "74.123° W";
	var position = new CoordinateConverter(lat, long);
	var originalCoordinates = position.getOriginalCoordinates();
	expect(originalCoordinates[0]).toEqual("40.123° N");
	expect(originalCoordinates[1]).toEqual("74.123° W");
}

test("Testing original coordinate getter", testCoordinateToDecimal);
