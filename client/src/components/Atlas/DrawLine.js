import {Polyline, Popup} from "react-leaflet";
import React, {Component, createRef} from "react";

export default class DrawLine extends Component {
    constructor(props) {
        super(props);
        this.tripRef = createRef();

        this.state = {
            findDist: this.props.findDist,
            markerCurrentLocation: this.props.markerCurrentLocation,
            markerPosition: this.props.markerPosition,
            dist: this.props.dist,
            singleLocationTrip: this.props.singleLocationTrip
        };
    }

    render() {
        if(this.props.findDist) {
            const initMarker = ref => {
                if (ref) {
                    ref.leafletElement.openPopup();
                }
            };
            if (this.props.markerCurrentLocation && this.props.markerPosition && this.props.dist != null) {
                return (
                    <Polyline ref={initMarker} color='red' positions={[this.props.markerCurrentLocation, this.props.markerPosition]}>
                        <Popup>{this.props.dist + " miles"}</Popup>
                    </Polyline>
                );
            }
            else if (this.props.singleLocationTrip) {
                return (
                    <Polyline ref={this.tripRef} color='red' positions={this.props.singleLocationTrip}/>
                );
            }
        }
        return null;
    }
}
