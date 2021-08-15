# Protocol Standard
## Fall 2020, Version 4 DRAFT

This document defines the standard object format that all clients and servers must use.
This format is shared with others to promote interoperabilty.
This object format may be used in files or as the body of a restful API request or response.
The [JSON](https://www.json.org/) format simplifies interactions:  

* between the client and server of the same or different tools,
* when loading or saving a file using the filesystem.

The key benefits include:

* Saved files may be exchanged between users and used with different clients.
* Clients and servers from different teams may interoperate.
* The best client and server may be selected independently.
* Automated grading with specialized clients and servers for each sprint.

The protocol standard will be updated during the semester to support new requirements.
If you don't understand the standard, ask questions since your grade depends on it.
Your client and server must interoperate with other teams.
Requests and replies that do not conform to the standard will receive a grade of 0.
We do not give partial credit.

* Questions about the protocol standard should be posted to **Piazza** with a __protocol__ tag.
* You may also request changes to the protocol standard through **Piazza** using the __protocol__ tag.


## Protocol Objects

A protocol object is a JSON object that contains a set of name/value pairs.
The required request version and request type elements determine the remaining elements in a particular object.

```javascript
{
  "requestVersion"      : 4,
  "requestType"         : "",
  ...
}
```

The `requestType` is a required element that determines the expected properties in the object.

* __config__ objects allow the server to provide configuration information to the client.
* __distance__ objects allow the client to request the distance between two geographic locations.
* __find__ objects allow the client to provide the user a list of possible destinations based on some criteria.
* __trip__ objects allow the client to request the distances for a series of geographic locations and share these itineraries as files.

The `requestVersion` is a required element, except for a **config** object.
The version will increment with each new release.
Versions are expected to be backwards compatible.


## config

A protocol object of type __config__ describes the server configuration.
These values are used to tailor the user experience on the client based on server capabilities.
The client sends an `HTTP POST` request to the `/api/config` restful API on the server.
For the `HTTP POST` request, the client sends a __config__ object in the body with only the `requestType` property specified.
The server responds with a __config__ object containing all of the properties.

This example request includes:

* the type of the request.

```json
{
  "requestType"        : "config"
}
```

This example response includes the information from the request, along with:

* the protocol version.
* the name of the web server.
* supported request types.
* list of values to filter search results.

```json
{
  "requestType"        : "config",
  "requestVersion"     : 4,
  "serverName"         : "t## team name",
  "supportedRequests"  : ["config", "distance", "find", "trip"],
  "filters"            : {
                           "type" : ["airport","heliport","balloonport"],
                           "where": ["Canada","Mexico","United States"]
                         }     
}
```

The `requestVersion` element specifies the protocol version that is supported by the server.

The `serverName` element identifies the server instance.
The value should be a string containing the team number and name.
This allows the client to identify which restful API server is currently in use during interoperability testing.

The `supportedRequests` element is a list containing strings with the names of the supported request types.
This version of the protocol supports the `"config"`, `"distance"`, `"find"`, and `"trip"` requests.

The `filters` element is an object containing two properties.
The `type` property identifies the different kinds of places available. 
Use only those provided in the example above.
The `where` property identifies locations by geographic elements. 
Some options for geographic elements incude: country name, region name, and/or municipality.
The server must support country names at a minimum.
The place names should not appear in the where list.

Other configuration elements will be added in the future versions.

For more detail, see the [ConfigRequest](ConfigRequest.json) and [ConfigResponse](ConfigResponse.json) JSON schemas.


## distance

A protocol object of the type __distance__ is used to obtain the distance between a pair of geographic locations.
This object is used in both the request from the client and the response from the server.
* The client sends an `HTTP POST` request to the `/api/distance` restful API service on the server with a __distance__ object in the HTTP request body.
* The server responds with a __distance__ object in the HTTP response body with the correct value for the distance.
* The distance is the Great Circle Distance with the specified radius of the earth.

This example response shows the distance from Fort Collins to Sydney in kilometers.

```json
{
  "requestType"    : "distance",
  "requestVersion" : 4,
  "place1"         : {"latitude":  "40.6",  
                      "longitude": "-105.1"},
  "place2"         : {"latitude":  "-33.9", 
                      "longitude": "151.2"},
  "earthRadius"    : 6371.0,
  "distance"       : 12345
}
```

The `place1`, `place2`, and `earthRadius` properties are required in the client request while the `distance` element is optional.
The response must include the unmodified `place1`, `place2`, and `earthRadius` elements from the request, along with the `distance` property.

The `place1` and `place2` properties are objects with `key:value` attributes that should contain `latitude` and `longitude` keys with string values.
The `latitude` and `longitude` attributes must be a string containing signed decimal degrees.

The `earthRadius` property must contain a floating point value denoting the radius of the earth to use for computations.

The `distance` property must contain a rounded integer value denoting the distance using the specified radius of the earth.

For more detail, see the [DistanceRequest](DistanceRequest.json) and [DistanceResponse](DistanceResponse.json) JSON schemas.


## find

A protocol object of the type __find__ is used to obtain a list of geographic locations matching some criteria.
This object is used in both the request from the client and the response from the server.
* The client sends an `HTTP POST` request to the `/api/find` restful API service on the server with a __find__ object in the request body.
* The server responds with a __find__ object in the response body with a list of places matching the criteria.

```javascript
{
  "requestType"    : "find",
  "requestVersion" : 4,
  "match"          : "",
  "narrow"         : {},
  "limit"          : 0,
  "found"          : 0,
  "places"         : []
}
```

The `match` element is optional and provides a text string to match appropriate fields in the data source.
The `narrow` element is optional and helps narrow the search using values supplied by the server in the __config__ object.
The `limit` element is optional in the client request and should only appear in the server response if it was provided in the client request.
The `places` and `found` elements are only required in the server response. 
They are ignored if provided in the request object.

The `match` element contains a string used to identify matching geographic locations in the available data sources.
A __find__ request with `"match":"dave"` should find all locations with the string `"dave"` in the name, municipality, region, or country fields of the database.
The string should only contain alphanumeric characters or an underscore.
The underscore, `_`, character is a single character wildcard to match special characters in the original match string entered by the user.
The `match` of `"dave_s"` would match `Dave's`.  
The server should convert all non-alphanumeric characters in the match string to underscores to prevent SQL injection attacks.

The `narrow` element contains filters to apply to the __find__ request on the server.
An empty `narrow` element, `"narrow":{}` is the same as not specifying the `narrow` element.
The __config__ object returned by the server defines the possible filter values.
A filter may include one or more values, such as `{"type":["airport","heliport"]}`.
A filter with no values is the same as not specifying the filter, as in `{"type":[]}`.
The request may specify both filters, as in `{"type":["airport","heliport"], "where":["United States"]}`.
The server should convert all non-alphanumeric characters in the narrow strings to underscores to prevent SQL injection attacks.

The `limit` element contains an integer that determines the maximum number of geographic locations that should appear in the places response from the server.
The client software uses this value to prevent the server from sending back too much information.
The user does not specify this value and it should not appear in the user interface.
A `limit` of 0 signifies that there is no limit on the number of locations that the client can accept from the server.
If no limit element is specified there is also no limit.
However, the server may have its own internal limits on the number of elements that it will return, but this should be a reasonably large value of at least 100.

The `found` element returns the total number of matching locations available in the data sources, not just the number of matching places returned.
It is independent of any limit.
This allows the client to report that 55 matches were found, but only 20 will appear in the response places list if the `limit` is 20.

The `places` element contains a list/array of objects describing the geographic locations.
Each object contains attributes describing the location that are available from the data source. 
All keys and values are strings.  
The `latitude` and `longitude` elements must be specified for each place in signed decimal degrees. 
Other suggested attributes for places appear in this example to support interoperability.
Additional attributes may be provided.

```
{
  "requestType"    : "find",
  "requestVersion" : 4,
  "match"          : "dave",
  "narrow"         : {"type":["airport"], "where":["United States"]},
  "limit"          : 10,
  "found"          : 1,
  "places"         : [{"name":"Dave's Airport", 
                       "latitude": "40.0332984924", 
                       "longitude": "-105.124000549",
                       "id":"0CO1",
                       "altitude":"5170",
                       "municipality":"Louisville",
                       "type":"small_airport",
                       "region":"Colorado",
                       "country":"United States",
                       "url":"https://www.aopa.org/destinations/airports/0CO1/details"
                       }]
}
```

This example response searched for `"dave"` with a `limit` of ten places in the response.  
The response notes that a single response was `found`.

If the `match` and `limit` elements are not specified, the server returns a single, randomly-selected place from the data source, with `"found":1`.
If the `match` element is not specific, but a `limit` is specified, the server returns the `limit` number of randomly-selected places from the data source, with the `found` value equal to the `limit`.
Here is an example response for this case when only `requestType` and `requestVersion` were specified in the request.

```
{
  "requestType"    : "find",
  "requestVersion" : 4,
  "found"          : 1,
  "places"         : [{"name":"Dave's Airport", 
                       "latitude": "40.0332984924", 
                       "longitude": "-105.124000549",
                       "id":"0CO1",
                       "altitude":"5170",
                       "municipality":"Louisville",
                       "type":"small_airport",
                       "region":"Colorado",
                       "country":"United States",
                       "url":"https://www.aopa.org/destinations/airports/0CO1/details"
                       }]
}
```

For more detail, see the [FindRequest](FindRequest.json) and [FindResponse](FindResponse.json) JSON schemas to be provided shortly.

## trip

A protocol object of the type __trip__ contains the distances between a series of geographic locations that form a round trip.
This object is used in the request from the client, the response from the server and saved files.
* The client sends an `HTTP POST` request to the `/api/trip` restful API service on the server with a __trip__ object in the request body.
* The server responds with a __trip__ object in the response body that includes the correct distances for each leg of the round trip journey.
* Files containing __trip__ objects may be saved or loaded by the client.

Here is an example of a trip request.

```json
{
  "requestType"    : "trip",
  "requestVersion" : 4,
  "options"        : { "earthRadius":"3959.0",
                       "units":"miles",
                       "title":"My Trip", 
                       "response":"0.0"
                     },
  "places"         : [{"name":"Denver",       "latitude": "39.7", "longitude": "-105.0"},
                      {"name":"Boulder",      "latitude": "40.0", "longitude": "-105.4"},
                      {"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1"}]
}
```

The `options` and `places` elements are required in the client request, server response, and file.
The `distances` element is optional in the client request and file, but required in the server response.

The `options` element contains a set of `key:value` properties with the keys `title`, `earthRadius`, `units`, and `response`. 
The required `earthRadius` is a string representing a numeric value corresponding to the radius of the earth for use in distance computations.
The optional `units` is a string denoting the units associated with earthRadius.
The optional `title` is a string for documentation purposes.
The optional `response` is a string respresenting a numeric value corresponding to the number of seconds allowed for optimization.  
If `response` is not specified or has the value `0.0`, no optimization should be performed.
Otherwise, the server must respond in less than the specified `response` time.

The list of locations in the `places` element represents a round trip, returning from the last item in the list to the first item.
The `name`, `latitude` and `longitude` elements must exist in each object in places.
The `latitude` and `longitude` elements must contain signed decimal degrees. 
Other elements may exist in a place object to further describe it, such as those suggested in the **find** object.
The value of each of these elements is a string.
An optional `coordinates` element may provide a string containing the coordinates in a format other than decimal degress, but these coordinates should be consistent with the `latitude` and `longitude` elements.


The `distances` element contains a list/array of integers representing the distances from the corresponding location to the following location.
The last entry represents the distance from the last location back to the first location.
Here is an example of a trip response, although the distances may not be accurate.

```json
{
  "requestType"    : "trip",
  "requestVersion" : 4,
  "options"        : { "title":"Shopping Loop", 
                       "earthRadius":"3959.0",
                       "units":"miles"
                     },
  "places"         : [{"name":"Denver",       "latitude": "39.7", "longitude": "-105.0", "notes":"The big city"},
                      {"name":"Boulder",      "latitude": "40.0", "longitude": "-105.4", "notes":"Home of CU"},
                      {"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1", "notes":"Home of CSU"}],
  "distances"      : [20, 40, 50]
}
```

The __trip__ object may be stored in files for sharing with other tools.
The `distances` element is optional in a file.
The `latitude` and `longitude` elements are not restricted to signed decimal degrees when stored in a file.
They must be converted from other formats to signed decimal degrees when sent to the server using a Restful API service.
The original format should be preserved when presented to the user or written to a file.
Additional place attributes such as those suggested in the **find** object, or a user entered `notes` element. 

```json
{
  "requestType"    : "trip",
  "requestVersion" : 4,
  "options"        : { "title":"Shopping Loop", 
                       "earthRadius":"3959.0",
                       "units":"miles"
                     },
  "places"         : [{"name":"Denver",       "latitude": "39.7", "longitude": "-105.0", "notes":"The big city"},
                      {"name":"Boulder",      "latitude": "40.0", "longitude": "-105.4", "notes":"Home of CU"},
                      {"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1", "notes":"Home of CSU"}],
  "distances"      : [20, 40, 50]
}
```

For more detail, see the [TripFile](TripFile.json), [TripRequest](TripRequest.json) and [TripResponse](TripResponse.json) JSON schemas.


## HTTP Status Codes

TIP supports three basic HTTP status codes in the response to the restful API request.  
The client must detect the response and report errors to the user in some manner.

* 200 means the request was successful.  
  The response body contains a JSON object with the additional information requested.
* 400 means the request was not successful due to an invalid request from the client.
  The response body will contain the original request body with no changes.
* 500 means the request was not successful due to an error that occurred while computing the result.  
  The response body will contain the original request body with no changes.


## Version History

#### Version 4.1 - October 28, 2020
* Added `units` to the **trip** options.
#### Version 4 DRAFT - October 25, 2020
* Added `coordinates` element to places.
* Added `filters` to **config** and `narrow` to **find**.
* Added `response` to **trip**.
* Updated `requestVersion` to 4.
#### Version 3.1 - October 8, 2020
* Additional attributes returned by **find** or stored in **trip** files.
#### Version 3 - October 4, 2020
* Added **trip** to supported reqeusts in __config__.
* Added the **trip** type.
* Updated `requestVersion` to 3.
* Modified the **find** behavior when no match is specified.
#### Version 2 - September 12, 2020
* Added supportedRequests to __config__.
* Updated `requestVersion` to 2.
* Added the **distance** type.
* Added the **find** type.
#### Version 1 - August 24, 2020
* Added the **config** type.
* Specified the valid HTTP status codes and body for responses.