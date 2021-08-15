import { LOG } from "../../utils/constants";
import HttpResponse from "../HttpResponse";
import { isJsonResponseValid } from "../../utils/restfulAPI";


export function processServerResponse(serverResponse, schema) {
	var httpResponse = new HttpResponse(serverResponse);
	if(!httpResponse.getServerErrorStatus()) {
    return (validateJSON(httpResponse.getServerResponse().data, schema));
  }
  else {
    throw(new Error(httpResponse.getServerStatusString()));
  }
}

function validateJSON(serverResponse, schema) {
    if(!isJsonResponseValid(serverResponse, schema)) {
      var message = "Invalid JSON returned from server for request.";
			LOG.error(message);
			throw(new Error(message));
    }
    else {
			return serverResponse;
    }
}