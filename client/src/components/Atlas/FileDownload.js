import {baseMap} from "./baseMap";
import {baseKML} from "./baseKML";

export default class FileDownload {
	constructor(tripItinerary) {
    this.tripItinerary = tripItinerary;
    this.fileExtension = "";
    this.fileText = "";
    this.nameChange = this.nameChange.bind(this);
    this.unitChange = this.unitChange.bind(this);
    this.changeFileExtension = this.changeFileExtension.bind(this);
    this.makeCSV = this.makeCSV.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.buildLatString = this.buildLatString.bind(this);
	}

	nameChange(event) {
			if (event.target.value) {
				this.tripItinerary.options.title = event.target.value;
			}
  		else {
  		  this.tripItinerary.options.title = "New Trip";
  		}
  }

  unitChange(units) {
    this.tripItinerary.options.units = units;
  }

  changeFileExtension(event) {
  		this.fileExtension = event.label;
  }

  downloadFile() {
    this.buildFileText();
  	let file = new Blob([this.fileText]);
  	let a = document.createElement('a'),
  		url = URL.createObjectURL(file);
  	a.href = url;
  	a.download = this.tripItinerary.options.title.replaceAll("/", "_").replaceAll("\\", "_").replaceAll("?", "_")
  		.replaceAll("%", "_").replaceAll("*", "_").replaceAll(":", "_")
  		.replaceAll("|", "_").replaceAll("\"", "_").replaceAll("<", "_")
  		.replaceAll(">", "_").replaceAll(".", "_").replaceAll(",", "_")
  		.replaceAll(";", "_").replaceAll("=", "_").replaceAll(" ", "_") + this.fileExtension;
  	document.body.appendChild(a);
  	a.click();
  	setTimeout(function() {
  		document.body.removeChild(a);
  		window.URL.revokeObjectURL(url);
  	}, 0);
  }

  buildFileText() {
  		if(this.fileExtension === '.json') {
        this.fileText = JSON.stringify(this.tripItinerary);
      }
  		else if(this.fileExtension === '.csv') {
        this.fileText = this.makeCSV(this.tripItinerary);
      }
  		else if(this.fileExtension === '.svg') {
				this.fileText = this.makeSVG(this.tripItinerary);
      }
  		else if(this.fileExtension === '.kml') {
            this.fileText = this.makeKML(this.tripItinerary);
      }
  }

  makeCSV() {
      let returnText = "Options,Title,Earth Radius,Units\n";
      returnText += "," + this.tripItinerary.options.title + "," + this.tripItinerary.options.earthRadius + "," + this.tripItinerary.options.units + "\n";
      returnText += "Places,Name,Latitude,Longitude" + /*,Notes*/ "\n";

      let place = 0;

      for(let p in this.tripItinerary.places) {
          let name = JSON.stringify(this.tripItinerary.places[place].name);
          let lat = JSON.stringify(this.tripItinerary.places[place].latitude);
          let long = JSON.stringify(this.tripItinerary.places[place].longitude);
          // let notes = this.tripItinerary.places[place].notes ? JSON.stringify(this.tripItinerary.places[place].notes) : "";
          returnText += "," + name.substring(1, name.length - 1) + "," + lat.substring(1, lat.length - 1) + "," + long.substring(1, long.length - 1) /*+ ", " + notes.substring(1, notes.length - 1)*/ + "\n";
          place++;
      }

      returnText += "Distances";
      place = 0;

      for(let d in this.tripItinerary.distances) {
          let dist = JSON.stringify(this.tripItinerary.distances[place]);
          returnText += "," + dist;
          place++;
      }

      return returnText;
  }
  
  makeSVG() {
      let returnText = baseMap();
      let place = 0;
      let longFirst = JSON.stringify(this.tripItinerary.places[0].longitude);
      let latFirst = JSON.stringify(this.tripItinerary.places[0].latitude);
      latFirst = this.buildLatString(latFirst);
  
  
      for(let p in this.tripItinerary.places){
          let long1 = JSON.stringify(this.tripItinerary.places[place].longitude);
          let lat1 = JSON.stringify(this.tripItinerary.places[place].latitude);
          lat1 = this.buildLatString(lat1);
          //long1 *= -1;
          if (place < this.tripItinerary.places.length - 1) {
              let long2 = JSON.stringify(this.tripItinerary.places[place + 1].longitude);
              let lat2 = JSON.stringify(this.tripItinerary.places[place + 1].latitude);
              lat2 = this.buildLatString(lat2);
              //long2 *= -1;
              returnText += "<line x1=" + long1 + " y1=" + lat1 + " x2=" + long2 + " y2=" + lat2 + " stroke=\"black\" stroke-width=\"1\"/>";
          }
          else {
              returnText += "<line x1=" + long1 + " y1=" + lat1 + " x2=" + longFirst+ " y2=" + latFirst + " stroke=\"black\" stroke-width=\"1\"/>";
          }
          place++;
      }
      returnText += "</svg></svg>";
      return returnText;
  }

  buildLatString(latitude) {
    latitude = latitude.substring(1,2) === "-" ? "\"" + latitude.substring(2, latitude.length) : "\"-" + latitude.substring(1, latitude.length-1) +"\"";
    return latitude;
  }

    makeKML() {
        let returnText = baseKML();
        let place = 0;
        let longFirst = JSON.stringify(this.tripItinerary.places[0].longitude);
        let latFirst = JSON.stringify(this.tripItinerary.places[0].latitude);
        longFirst = longFirst.substring(1, longFirst.length-1);
        latFirst = latFirst.substring(1, latFirst.length-1);

        for (let p in this.tripItinerary.places) {
            let long1 = JSON.stringify(this.tripItinerary.places[place].longitude);
            let lat1 = JSON.stringify(this.tripItinerary.places[place].latitude);
            long1 = long1.substring(1, long1.length-1);
            lat1 = lat1.substring(1, lat1.length-1);

            if (place < this.tripItinerary.places.length - 1) {
                let long2 = JSON.stringify(this.tripItinerary.places[place + 1].longitude);
                let lat2 = JSON.stringify(this.tripItinerary.places[place + 1].latitude);
                long2 = long2.substring(1, long2.length-1);
                lat2 = lat2.substring(1, lat2.length-1);

                returnText += this.makePlacemark(long1, lat1, long2, lat2);
            } else {
                returnText += this.makePlacemark(long1, lat1, longFirst, latFirst);
            }
            place++;
        }
        returnText += "</Document>\n" +
            "</kml>";
        return returnText;
    }

    makePlacemark(long1, lat1, long2, lat2){
	    return "<Placemark>\n" +
            "  <name>Cross-corner line</name>\n" +
            "  <styleUrl>#CrossStyle</styleUrl>\n" +
            "  <LineString>\n" +
            "    <coordinates> " + long1 + "," + lat1 + ",0\n" +
            long2 + "," + lat2 + ",0 </coordinates>\n" +
            "  </LineString>\n" +
            "</Placemark>";
    }
}

