import {Marker, Popup} from "react-leaflet";
import React, {Component} from "react";
import L from "leaflet";
const MARKER_ICON = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 40] });
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default class GetMarker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            markerPosition: this.props.markerPosition,
            popupText: this.props.popupText,
            latLongPopup: this.props.latLongPopup
        }
    }

    render() {
        const initMarker = ref => {
            if (ref) {
                ref.leafletElement.openPopup()
            }
        };

        if (this.props.markerPosition) {
            return (
                <Marker ref={initMarker} position={this.props.markerPosition} icon={MARKER_ICON}>
                    <Popup offset={[0, -18]} className="font-weight-bold">
                        <div style={{margin: "auto"}}>
                            {this.props.popupText}
                        </div>
                        <div style={{display:"flex", justifyContent: "center"}}>
                            {this.props.latLongPopup}
                        </div>
                    </Popup>
                </Marker>
            );
        }
        else {
            return null;
        }
    }
}
