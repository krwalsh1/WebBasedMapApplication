import React, {Component} from "react";
import {Marker, Polyline, Popup} from "react-leaflet";

export default class TripDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addMarker: null
        }
    }

    render() {
        return (
            this.props.allTripMarkers.map((position, idx) =>
                    <>
                        <Marker ref={this.props.initMarkerRef} position={position} icon={this.props.markerIcon}>
                            <Popup offSet={[0, -20]}>{this.props.markerNames[idx]}</Popup>
                        </Marker>
                        {this.renderPolyLines("tripLines")}
                        {this.renderPolyLines("end")}
                    </>
                )
        );
    }

    renderPolyLines(locationParameter) {
      return (<Polyline ref={this.multipleDestTrip} color={this.props.lineColor} positions={this.props[locationParameter]}/>)
    }
}
