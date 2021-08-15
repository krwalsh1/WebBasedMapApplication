import React, { createRef, Component, useRef, Fragment} from 'react';
import {Col, Container, Row, Button, Form, FormGroup, Label, Input, Card, CardBody, Collapse} from 'reactstrap';
import Control from 'react-leaflet-control';
import Select from 'react-select';
import { GithubPicker } from 'react-color';
import Tooltip from "@material-ui/core/Tooltip";

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { LOG } from "../../utils/constants";
import * as distanceSchema from "../../../schemas/ResponseDistance";
import * as findSchema from "../../../schemas/FindResponse";
import { isJsonResponseValid, sendServerRequest } from "../../utils/restfulAPI";
import HttpResponse from "../HttpResponse";

import { loadTrip } from "./loadTrip"
import { buildTripTable } from "./tripItineraryHelperFunctions"
import Trip from "./Trip"
import Distance from "./Distance"
import CoordinateConverter from "./CoordinateConverter";
import TripDisplay from "./TripDisplay";
import {popupInfo} from "./popupInfo";
import {buildFilterList} from "./FilterLists";
import GetMarker from "./GetMarker";
import DrawLine from "./DrawLine";

const MAP_BOUNDS = [[-90, -180], [90, 180]];
const MAP_CENTER_DEFAULT = [40.5734, -105.0865];
const MARKER_ICON = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 40] });
const USER_LOCATION_MARKER_ICON = L.icon({ iconUrl: 'https://i.imgur.com/XPpK3Vm.png',iconAnchor: [12, 40] });
const TRIP_MARKER_ICON = L.icon({ iconUrl: 'https://i.imgur.com/Ipi7JXF.png',iconAnchor: [12, 40] });
const MAP_LAYER_ATTRIBUTION = "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors";
const MAP_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 19;
const GEOLOCATION_ICON = "https://i.imgur.com/SYY3mdo.png";

var markerLatLong = MAP_CENTER_DEFAULT;

export default class Atlas extends Component {
    constructor(props) {
        super(props);
        this.mapRef = createRef();
        this.currLocRef = createRef();
        this.initMarkerRef = createRef();
        this.multipleDestTrip = createRef();
				this.placesSelect = React.createRef();
				this.toggleReverseTrip = this.toggleReverseTrip.bind(this);
        this.addLoadedTripMarkers = this.addLoadedTripMarkers.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.setMarker = this.setMarker.bind(this);
        this.startSearching = this.startSearching.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.findDistance = this.findDistance.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleLatChange = this.handleLatChange.bind(this);
        this.handleLongChange = this.handleLongChange.bind(this);
        this.handleTripButton = this.handleTripButton.bind(this);
        this.handleDistanceButton = this.handleDistanceButton.bind(this);
        this.addMarkerManually = this.addMarkerManually.bind(this);
        this.checkLatLong = this.checkLatLong.bind(this);
        this.setTripOptimizedState = this.setTripOptimizedState.bind(this);
        this.toggleLoadTrip = this.toggleLoadTrip.bind(this);
        this.loadTrip = this.loadTrip.bind(this);
        this.drawOptimizedLines = this.drawOptimizedLines.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.renderFilterSection = this.renderFilterSection.bind(this);
        this.renderSearchAndButtons = this.renderSearchAndButtons.bind(this);
        this.renderTripOptionsAndSelect = this.renderTripOptionsAndSelect.bind(this);
        this.renderFilterLists = this.renderFilterLists.bind(this);
        this.getReverseGeoInfo = this.getReverseGeoInfo.bind(this);
        this.renderMapCurrentLocation = this.renderMapCurrentLocation.bind(this);
        this.renderMapAddMarkerManually = this.renderMapAddMarkerManually.bind(this);
        this.renderMapTripControlOptions = this.renderMapTripControlOptions.bind(this);
        this.renderMapDistanceButton = this.renderMapDistanceButton.bind(this);
        this.processFindResults = this.processFindResults.bind(this);
        this.tripPlaces = [];
        this.tripResponse;
        this.response = "0.0";
        this.tripUnits = undefined;
        this.earthRadius = 3958.756; //Default earthradius to miles
        this.tripTitle = undefined;
        this.newColorOptions = ['#1E4D2B','#C8C372','#FFFFFF','#59595B','#D9782D','#C9D845','#CC5430','#105456','#12A4B6','#ECC530']

        // This state variable is to avoid atlas from breaking
        // when adding a place after loading a trip.
        // It should be removed for future sprints
        this.tripLoaded = false;



        this.state = {
            markerPosition: null, singleLocationTrip: [[0, 0], [0, 0]], markerCurrentLocation: [0,0], allTripMarkers: [],
            tripLinesOptimized: [], tripMarkerNames : [], firstDestination: [], lastDestination: [], numberOfTripMarkers: 0,
            multipleMarkersActive: false, tripState: false, dist: null, searchTerm: "", locationResults: [],
            foundResults: null, countryFilters: [], typeFilters: [], activeCountryFilter: "",
            activeTypeFilter: "", loadTripToggleIsOpen: false, tripLineColor: "#CC5430", tripMarkerColor: "#CC5430", tripColorOptions: [], tripColorMessage:"Trip options unavailable",
            customLatitude: 0, customLongitude: 0, findDist: false, popupText: "", tripBuildingBoxColor: "danger", tripBoxMessage: "Build Trip Mode (Disabled)", makeTrip: false, latLongPopup: [], tripReversed: false
        };

        this.handleColorChange = (color) => {
            this.setState({ tripLineColor: color.hex });
        };
    }

    goToCurrentLocationMarker() { // This function is used to create the marker signifying the users current location
        const map = this.mapRef.current.leafletElement;
        const currMarker = this.currLocRef.current.leafletElement;
        currMarker.openPopup();
        map.flyTo(this.state.markerCurrentLocation, 16, {duration: .5});
    }

    startSearching(){
        let typeFilterTerm = this.state.activeTypeFilter;
        let countryFilterTerm = this.state.activeCountryFilter;
        let searchTerm = (this.state.searchTerm == false) ? "" : this.state.searchTerm;
        if (typeFilterTerm.includes("_")){
            typeFilterTerm = "";
        }
        if (countryFilterTerm.includes("_")){
            countryFilterTerm = "";
        }
        sendServerRequest({requestType: "find", requestVersion: 4, match: searchTerm, narrow: JSON.parse('{"type":[' + typeFilterTerm + '], "where": ['+countryFilterTerm+']}')}).then(find => {
            var httpResponse = new HttpResponse(find);
            if (httpResponse.getServerErrorStatus()){
                this.processFindResponse(httpResponse.getServerResponse().data);
                this.setState({locationResults: []});
                this.props.createSnackBar(httpResponse.getServerStatusString());
            }
            else {
							this.processFindResults(httpResponse.getServerResponse().data);
						}
        });
    }

    processFindResults(findTestResponse) {
      var testPlaces = findTestResponse["places"];
      var currentLocationTrip = '{"label": "User Location", "value": ' + 0 + ', "name": "User Location", "type": "default", "latitude": "' + this.state.markerCurrentLocation[0] + '", "longitude": "' + this.state.markerCurrentLocation[1] + '"}'; //This is a findResponse object for the users location (in a string) that will be converted to JSON 4 lines down.
      var namesOfPlaces = [];
      namesOfPlaces.push(JSON.parse(currentLocationTrip)); // Add the users location as a JSON object to the top of the selection list before all other locations get pushed.

      for (var i in testPlaces){
        let splitString = JSON.stringify(testPlaces[i]);
        let newString = splitString.substr(splitString.indexOf("name") + 7, splitString.length - 1);
        newString = newString.substr(0, newString.indexOf("type") - 3);
        ++i; //i is incremented here because the Users location already has the value 0 and this prevents the first entry in the list from having a value of 0 as well
        let jsonString = '{"value": ' + i + ', "label": "' + newString + '"}';
        namesOfPlaces.push(JSON.parse(jsonString));
      }
      testPlaces.unshift(JSON.parse(currentLocationTrip)); // Unshift() pushes the users location object at the front of the places[{},{}...] array so that it is read first
      this.setState({locationResults: namesOfPlaces, foundResults: testPlaces});
    }

    handleChange(event){
        this.setState({searchTerm: event.target.value});
    }

    addMarker(latString, longString, markerInfo){
        let newMarker = [latString, longString];
        var numTripMarkers = this.state.numberOfTripMarkers;
        ++numTripMarkers; // Increases number of trip markers by one every time this function is called
        var currentMarkers = this.state.allTripMarkers;
        currentMarkers.push(newMarker);
        var currentMarkerNames = this.state.tripMarkerNames;
        currentMarkerNames.push(popupInfo(markerInfo));
        this.setState({markerPosition: newMarker, popupText: popupInfo(markerInfo), numberOfTripMarkers: numTripMarkers, allTripMarkers: currentMarkers, tripMarkerNames: currentMarkerNames}); // Adds name of trip destination to tripMarkerNames[] so that it can display in a popup when clicked on the map
        //****Remove markerPosition and popupText setStates when trip markers get popups back*****
        const map = this.mapRef.current.leafletElement;
        map.flyTo(newMarker, 16, {duration: .5});               // Zooms onto newly added trip marker
    }

    addLoadedTripMarkers(){
        var currentMarkers = this.state.allTripMarkers;
        var currentMarkerNames = this.state.tripMarkerNames;
        for (var i = 0; i < this.tripPlaces.length; i++){
            currentMarkers.push([this.tripPlaces[i].latitude, this.tripPlaces[i].longitude])
            currentMarkerNames.push([this.tripPlaces[i].name]);
        }
        this.setState({
            allTripMarkers: currentMarkers,
            tripMarkerNames: currentMarkerNames
        })
        return;
    }

    handleSubmit(event){
        event.preventDefault();
        this.startSearching();
				this.placesSelect.current.select.focusInput();
    }

    drawOptimizedLines(newTrip){    //This function is used for generating a coordinate array from the trip itinerary table for the <Polyline>'s rendered on the map
        this.setState({             // Remove previously set trip lines because optimizing the trip usually reorders the lines completely
            tripLinesOptimized: []
        });
        var newMarkers = [];
        var currentLines = [];
        for (var i = 0; i < newTrip.places.length; i++) { //Loop through destinations in places[], parsing the latitude and longitude from each destination.
            let nextLat = newTrip.places[i].latitude;
            let nextLong = newTrip.places[i].longitude;
            currentLines.push([nextLat,nextLong]);
        }
        this.setState({tripLinesOptimized: currentLines}); // Adds coordinates of each destination for generating lines

        // Get information from first and last location in the list to draw the connecting line from the first to the last destination (round trip line)
        let firstLat = newTrip.places[0].latitude
        let lastLat = newTrip.places[newTrip.places.length - 1].latitude
        let firstLong = newTrip.places[0].longitude
        let lastLong = newTrip.places[newTrip.places.length - 1].longitude
        this.setState({firstDestination: [firstLat,firstLong], lastDestination: [lastLat,lastLong]});    // This sets the line connecting the first destination and the last
    }

    componentDidMount() {
        if (navigator.geolocation) {  // If they click [Allow]
            navigator.geolocation.getCurrentPosition(success); // Go to success function which logs their coordinates into this app
            this.setState({markerCurrentLocation: markerLatLong});
        }
        sendServerRequest({requestType: "config", requestVersion: 4})
          .then(config => { //This function is used to populate the Filter Options with the supported country names and airport types
            var httpResponse = new HttpResponse(config);
            if (httpResponse.getServerErrorStatus()) {
                this.processFindResponse(httpResponse.getServerResponse().data);
                this.props.createSnackBar(httpResponse.getServerStatusString());
            }
            else {
                var testResponse = httpResponse.getServerResponse().data;
                var testCountries = testResponse["filters"]["where"];
                var testTypes = testResponse["filters"]["type"];
                let countryFilterOptions = [JSON.parse('{"label": "All Countries", "value": ' + 0 + ', "name": "_"}')];
                let typeFilterOptions = [JSON.parse('{"label": "All Types", "value": ' + 0 + ', "name": "_"}')];
                this.setState({countryFilters: buildFilterList(countryFilterOptions, testCountries), typeFilters: buildFilterList(typeFilterOptions, testTypes)});
            }
            this.setState({activeCountryFilter: "", activeTypeFilter: ""}) //Clear previous filter status
          }
        );
    }

    handleCountryChange(event){
        let labelString = '"' + event.name + '"';
        this.setState({activeCountryFilter: labelString});
    }

    handleTypeChange(event){
        let labelString = '"' + event.name + '"';
        this.setState({activeTypeFilter: labelString});
    }

   selectChange(event) {
        if (this.state.locationResults) {

            let latFromString = parseFloat(this.state.foundResults[event.value]["latitude"]);
            let longFromString = parseFloat(this.state.foundResults[event.value]["longitude"]);

            let tripLocation = this.state.foundResults[event.value];

            if(!this.state.makeTrip) {
                let info = popupInfo(tripLocation);
                this.setState({markerPosition: {lat: latFromString, lng: longFromString}, popupText: info})

                const map = this.mapRef.current.leafletElement;
                map.flyTo([latFromString, longFromString], 16, {duration: .5});
            }

            if (this.state.makeTrip) {
                this.addMarker(latFromString, longFromString, this.state.foundResults[event.value]);
                this.tripPlaces.push(tripLocation);
                this.buildTrip(latFromString, longFromString);
            }
        }
    }

    async buildTrip() {
        try {
            var newTrip = new Trip(this.tripTitle, this.tripUnits, this.earthRadius.toString(), this.response, this.tripPlaces);
            await newTrip.sendTripRequest();
        }
        catch(error) {
            this.props.createSnackBar(error.message);
        }
        this.tripResponse = newTrip.getTrip();
        this.setState({tripState: true});

        this.drawOptimizedLines(this.tripResponse);
        //Open up trip line colors options
        this.setState({
            tripColorOptions: this.newColorOptions,
            tripColorMessage: "Trip Line Color:"
        });
    }

    toggleReverseTrip(){
        let reversedLocations = this.tripPlaces.reverse();
        this.tripPlaces = reversedLocations;
        this.buildTrip();
        this.setState({
        tripReversed : !this.state.tripReversed
        })
        return;
    }

    handleTripButton(){
        this.setState({makeTrip: !this.state.makeTrip})
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col sm={12} md={{size: 10, offset: 1}}>
                            {this.renderLeafletMap()}
                            <p/>
                            {this.renderLoadTripToggle()}
                            <p/>
                            {this.renderSearchAndButtons()}
                            <p/>
														{this.renderFilterSection()}
                            <p/>
                            {this.renderTripOptionsAndSelect()}
                        </Col>
                    </Row>
                    <p/>
                    <Row>
                        <Col sm={12} md={{size: 10, offset: 1}}>
                            {buildTripTable(this.tripResponse, this.state.tripState, this.state.makeTrip, this.state.popupText, this.tripLoaded, this.state.tripReversed)}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    renderLoadTripToggle() {
        return (
            <Col>
                <Button color="primary" onClick={this.toggleLoadTrip} style={{ marginBottom: '1rem' }} block>Upload Trip</Button>
                <Collapse isOpen={this.state.loadTripToggleIsOpen}>
                    <Card>
                        <CardBody>
                            <Form><FormGroup><Input type="file" name="file" id="loadTripFile" /></FormGroup></Form>
                            <Button color="secondary" onClick={this.loadTrip} block>Process Trip</Button>
                        </CardBody>
                    </Card>
                </Collapse>
            </Col>
        );
    }

    toggleLoadTrip() {
       this.setState({loadTripToggleIsOpen: !this.state.loadTripToggleIsOpen});
    }

		renderSearchAndButtons() {
			return (
				<form onSubmit={this.handleSubmit}>
                    <Tooltip title="Your location appears with any search" arrow>
                        <Input type='text' value={this.state.searchTerm} onChange={this.handleChange} size={18} placeholder='Enter a location'/>
                    </Tooltip>
                  <p/>
                  <Tooltip title="Search for a random place or type your desired location" arrow>
                      <Button type='submit'>{this.state.searchTerm ? 'Search' : 'Feeling Lucky?'}</Button>
                  </Tooltip>
                  &nbsp;
                  <Tooltip title="Start a trip from next selected destination, or reselect current destination" arrow>
                      <Button color={this.state.makeTrip ? "primary" : "danger"} onClick={this.handleTripButton}>{this.state.makeTrip ? "Make a Trip (Enabled)" : "Make a Trip (Disabled)"}</Button>
                  </Tooltip>
                </form>
            );
		}

    renderFilterSection() {
      return (
        <Fragment>
          <Button color="secondary" onClick={this.handleSubmit} block>Apply Filter</Button>
          <table style={{width:'100%'}}>
            <tbody>
              <tr>
                {this.renderFilterLists("Country")}
                {this.renderFilterLists("Type")}
              </tr>
            </tbody>
          </table>
        </Fragment>
      );
    }

    renderFilterLists(filterParameter) {
      const filterParameterFirstLetterLowerCase = filterParameter[0].toLowerCase() + filterParameter.substr(1);
      return (
				<td style={{width:'50%'}}>
					<Select
						placeholder={"Filter by " + filterParameter}
						options={this.state[filterParameterFirstLetterLowerCase + "Filters"]}
						autosize={true}
						onChange={this["handle" + filterParameter + "Change"]}
					/>
				</td>
      );
    }

    renderTripOptionsAndSelect() {
      var tripOptionsAndSelect = [];
      if (this.state.tripState && this.state.makeTrip) {
        tripOptionsAndSelect.push(
          <Fragment>
            <Button style={{float: 'right'}} onClick={this.toggleReverseTrip}>Reverse Trip Order</Button>
            {'  '}<label style={{float:'left'}} htmlFor="optimizeTripCheckBox">Optimize Trip:&nbsp;</label>
            <input type="checkbox" id="optimizeTripCheckBox" onClick={this.setTripOptimizedState}/>
            <br/><br/>
          </Fragment>
        );
      }
      tripOptionsAndSelect.push(
        <Fragment>
          <Select
            ref={this.placesSelect}
            openMenuOnFocus={true}
            options={this.state.locationResults}
            placeholder={"Enter a location above to build a trip"}
            onChange={this.selectChange}
          />
        </Fragment>
      );
      return tripOptionsAndSelect;
    }

    async loadTrip() {
        this.tripLoaded = true;
        this.toggleLoadTrip();
        if (document.getElementById("loadTripFile").files.length === 0) {
            LOG.info("No file selected");
        }
        else {
            try {
                var loadedTripFile = document.getElementById("loadTripFile").files[0];
                var loadedTrip = await loadTrip(loadedTripFile);
                this.tripTitle = loadedTrip.title;
                this.tripUnits = loadedTrip.units;
                this.earthRadius = loadedTrip.earthRadius;
                this.response = loadedTrip.response;
                this.tripPlaces = loadedTrip.places;
                LOG.info(this.tripPlaces);
                this.buildTrip();
                this.addLoadedTripMarkers();
            }
            catch(error) {
                LOG.info("Error loading file");
                this.props.createSnackBar("Error loading file: " + error.message);
            }
        }
    }


    setTripOptimizedState() {
        var optimizeTripCheckBox = document.getElementById("optimizeTripCheckBox");
        if (optimizeTripCheckBox.checked === true) {
            this.response = "1.0";
        }
        if (optimizeTripCheckBox.checked === false) {
            this.response = "0.0";
        }
        if (this.state.tripState === true) {
            this.buildTrip();
        }
    }

  async findDistance() {
      if (this.state.markerPosition) {
          const place1 = {
            latitude: this.state.markerCurrentLocation[0].toString(),
            longitude: this.state.markerCurrentLocation[1].toString()
          };
          const place2 = {
            latitude: this.state.markerPosition.lat.toString(),
            longitude: this.state.markerPosition.lng.toString()
          };
          try {
            var newDistance = new Distance(place1, place2, parseFloat(this.earthRadius));
            await newDistance.sendDistanceRequest();
          }
          catch(error) {
            this.props.createSnackBar(error.message);
          }
          const distanceResponse = newDistance.getDistance();
          this.setState({dist: distanceResponse.distance});
      }
  }

    checkLatLong(){
        if (this.state.customLatitude.substring(0,4 + this.state.customLatitude.indexOf("-")) < -90 || this.state.customLatitude.substring(0,4 + this.state.customLatitude.indexOf("-")) > 90 || this.state.customLongitude.substring(0,4 + this.state.customLongitude.indexOf("-")) < -180 || this.state.customLongitude.substring(0,4 + this.state.customLongitude.indexOf("-")) > 180){
            window.alert("Invalid Latitude/Longitude Coordinates specified. Latitude coordinate °(N/S) range must be between -90 and 90, Longitude coordinate °(W/E) range must be between -180 and 180.");
            return;
        }
        else return;
    }

    addMarkerManually(event){
        event.preventDefault();
        this.checkLatLong();
        var latLongforMarker;
        let mapClickInfo = {"latlng":{}};
        const map = this.mapRef.current.leafletElement;
        if (this.state.customLatitude.toString().includes("°")){ //If the user specifies coordinates instead of lat/long
            try {
                let latLongFromCoords = new CoordinateConverter(this.state.customLatitude, this.state.customLongitude);
                latLongforMarker = L.latLng(latLongFromCoords.coordinateToDecimal()[0], latLongFromCoords.coordinateToDecimal()[1]);
                mapClickInfo.latlng = L.latLng(latLongFromCoords.coordinateToDecimal()[0], latLongFromCoords.coordinateToDecimal()[1]);
                map.flyTo(latLongforMarker, 16, {duration: .5});
            }
            catch (error){
                window.alert(error);
            }
        }
        else {
        latLongforMarker = L.latLng(this.state.customLatitude, this.state.customLongitude);
        mapClickInfo.latlng = L.latLng(this.state.customLatitude, this.state.customLongitude)
        map.flyTo(latLongforMarker, 16, {duration: .5});
        }
        this.setMarker(mapClickInfo);
    }

    handleLatChange(event){
        this.setState({customLatitude: event.target.value});
    }

    handleLongChange(event){
        this.setState({customLongitude: event.target.value});
    }

    handleDistanceButton(){
        this.setState({findDist: !this.state.findDist});
        this.findDistance();
    }

    renderLeafletMap() {
      return (
        <Map
          className={'mapStyle'}
          boxZoom={true}
          useFlyTo={true}
          zoom={17}
          duration={.75}
          ref={this.mapRef}
          minZoom={MAP_MIN_ZOOM}
          maxZoom={MAP_MAX_ZOOM}
          maxBounds={MAP_BOUNDS}
          center={MAP_CENTER_DEFAULT}
          onClick={this.setMarker}
        >
          {this.renderMapCurrentLocation()}
          {this.renderMapAddMarkerManually()}
					{this.renderMapTripControlOptions()}
          <TileLayer url={MAP_LAYER_URL} attribution={MAP_LAYER_ATTRIBUTION} />
					{this.renderMapDistanceButton()}
          {this.getMarkerCurrentLocation()}
          <TripDisplay allTripMarkers={this.state.allTripMarkers} markerNames={this.state.tripMarkerNames} initMarkerRef = {this.initMarkerRef} markerIcon={TRIP_MARKER_ICON} lineColor={this.state.tripLineColor} tripLines={this.state.tripLinesOptimized} end={[this.state.firstDestination,this.state.lastDestination]}/>
          <GetMarker markerPosition={this.state.markerPosition} popupText={this.state.popupText} latLongPopup={this.state.latLongPopup}/>
          <DrawLine findDist={this.state.findDist} markerCurrentLocation={this.state.markerCurrentLocation} markerPosition={this.state.markerPosition} dist={this.state.dist} singleLocationTrip={this.state.singleLocationTrip}/>
        </Map>
      );
    }

    renderMapCurrentLocation() {
      return (
				<Control position="bottomleft">
          <Tooltip title="Go to your location" arrow placement="right">
            <Button style={{padding: '0.2em'}} size="sm" color="success" onClick={() => this.goToCurrentLocationMarker()}>
              <img src={GEOLOCATION_ICON} width="25px" height="25px"/>{/*My Location button*/}
            </Button>
          </Tooltip>
        </Control>
      );
    }

		renderMapAddMarkerManually() {
			return (
				<Control position="topright">
          <form onSubmit={this.addMarkerManually}>
            <Input type='text' style={{marginLeft: 'auto', display: 'flex'}} onChange={this.handleLatChange} size="14" placeholder='Latitude or °N/S'/>
            <Input type='text' style={{marginLeft: 'auto', display: 'flex'}} onChange={this.handleLongChange} size="14" placeholder='Longitude or °W/E'/>
            <Button size="sm"  style={{marginLeft: 'auto', display: 'flex'}} color="secondary" type='submit' value='Add Marker'>Add Marker</Button>
          </form>
        </Control>
			);
		}

		renderMapTripControlOptions() {
		    if (this.state.tripColorMessage != "Trip options unavailable"){
			    return (
                    <Control position="bottomright" width="50%">
                        <Button color="primary" style={{marginLeft: 'auto', display: 'flex'}} disabled><strong>{this.state.tripColorMessage}</strong></Button>
                        <GithubPicker colors={this.state.tripColorOptions} triangle="top-right" onChangeComplete={this.handleColorChange}/>
                    </Control>
			    );
			}
		}

		renderMapDistanceButton() {
			return (
        <Control position="topleft">
          <Tooltip title="Distance from your location to marker" arrow placement="right">
            <Button color="light" size="sm" onClick={this.handleDistanceButton}>
              &#128207; {/*Distance button*/}
            </Button>
          </Tooltip>
        </Control>
			);
		}

    getMarkerCurrentLocation() {
        return (
            <Marker ref={this.currLocRef} position={this.state.markerCurrentLocation} icon={USER_LOCATION_MARKER_ICON}>
                <Popup offset={[0, -18]} className="font-weight-bold">Your Location</Popup>
            </Marker>
        );
    }

    async getReverseGeoInfo(inputLat, inputLong){
        let postURL = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=";
        postURL += inputLat + "&longitude=" + inputLong + "&localityLanguage=en";
        let response = await fetch(postURL);
        let data = await response.json();
        let reverseGeoString = data.locality;
        reverseGeoString += (data.principalSubdivision != null && data.principalSubdivision != "") ? ", " + data.principalSubdivision + "." : ".";
        reverseGeoString += (data.countryCode != null && data.countryCode != "__") ? " " + data.countryCode + "." : "";
        this.setState({popupText: reverseGeoString});
    }

    setMarker(mapClickInfo) {
        this.setState({markerPosition: mapClickInfo.latlng, singleLocationTrip: [[mapClickInfo.latlng], mapClickInfo.latlng]},
         () => {this.setState({latLongPopup: this.getStringMarkerPosition()})}
        );
        this.getReverseGeoInfo(mapClickInfo.latlng.lat, mapClickInfo.latlng.lng);
        this.findDistance();
    }

    getStringMarkerPosition() {
        return this.state.markerPosition.lat.toFixed(2) + ', ' + this.state.markerPosition.lng.toFixed(2);
    }

    processFindResponse(findResponse) {
        if(!isJsonResponseValid(findResponse, findSchema)){
            this.processServerError("Find Response not valid. Check the server.");
        }
    }

    processServerError(message) {
        LOG.error(message);
    }
}

function success(position) { // This is the position-tracking and logging function from navigator.geolocation, it has a strict format and will not work as a class method so it sits here just outside the class for now.
    markerLatLong = (L.latLng(position.coords.latitude, position.coords.longitude)); // This constructs a leaflet marker object using the user's location coordinates
}
