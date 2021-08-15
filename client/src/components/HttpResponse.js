import { LOG } from "../utils/constants";

export default class HttpResponse {
    constructor(response) {
        this.serverResponse = response;
        this.serverStatusString = null;
        this.errorStatus = false;

        this.httpErrorHandler(this.serverResponse);
    }

    httpErrorHandler(serverResponse) {
        if(serverResponse.status === 200) {
    	    this.serverStatusString = "Status 200: Server request successful";
    		  LOG.info(this.serverStatusString);
    	    this.errorStatus = false;
        }
        else if(serverResponse.status === 400) {
    	    this.serverStatusString = "Error 400: Invalid request from client";
    		  LOG.error(this.serverStatusString);
    	    this.errorStatus = true;
    	}
    	else if(serverResponse.status === 500) {
    	    this.serverStatusString = "Error 500: Internal Server Error";
    	   	LOG.error(this.serverStatusString);
    	    this.errorStatus = true;
    	}
    	else {
    	    this.serverStatusString = "Unknown response status from the server";
    	   	LOG.error(this.serverStatusString);
    	    this.errorStatus = true;
    	}
    	return;
    }

    getServerStatusString() {
        return this.serverStatusString;
    }

    getServerErrorStatus() {
        return this.errorStatus;
    }

    getServerResponse() {
        return this.serverResponse;
    }
}

