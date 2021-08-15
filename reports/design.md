# Introduction

This document describes the architecture and design of a single page web application that interacts with microservices via RESTful APIs.
The key elements in this document include the architecture, user interface, client components, and server classes.

This is a living document that is updated as changes are made each sprint.
The initial document describes the Base code students are given as a starting point for the semester.
Students are expected to update this document as changes are made each sprint to reflect the evolution of their application and key decisions they make.
The Base section serves as an example.


# Base

The Base is a simple application to provide the architecture to the students at the beginning of the semester.
The JavaScript code will be useful examples for students to learn from and leverage in the code they write for sprint 1.
The progressive display of information using collapsible sections and popups will serve as examples of good user interface design.
The overall design is somewhat minimalist/simple for the intended mobile device audience.

### Architecture

The Base architecture is a JavaScript single page web application in an HTML5 browser that uses RESTful APIs to access Micro-services provided by a Java server running on Linux.
The client consists of a minimal index.html file that loads and executes the bundled JavaScript application.
The client and server files are bundled into a single JAR file for execution on the Linux server at a specified port.
The browser fetches the client files from the server on the specified port.

![overview](./Architecture%20&%20Design//basearchitecture.png)

The browser loads the index.html file (by default) which in turn loads the bundled JavaScript single page application bundle.js.
* The single page application makes RESTful API requests to the server on the same port using  JavaScript's asynchronous fetch.  
* A protocol document describes the JSON format for the RESTful API requests and responses.
* JSON Schemas are used to verify requests on the server side and responses on the client side.
* On the client, ReactJS renders the application using ReactStrap, Leaflet, and application defined components.
* GSON is used on the server to convert JSON requests to Java objects and Java objects to JSON responses.
* The client (ulog) and server (SLF4J) logging mechanisms control debugging output during development and production - print statements and console logging should never be used. 

The following architecture elements are not included in the Base system.
They will be added later in the semester.
* Client filesystem .
* Server SQL .
* Server concurrency.


### User Interface
![base](./Architecture%20&%20Design/UserInterface.png)

The basic screen in black shows the view on a mobile device, with a header, footer, and map.
The header contains a earth logo and the team name obtained from the server when the client was loaded.
The footer contains a connection icon along with the current server name and server URL the client is connected to.
The blue areas highlight the actions that may be performed.

Rather than buttons or icons to signify actions, we are associating actions with elements that are already on the screen to reduce the clutter.
We are using both popups and collapsible sections in this design rather than choosing to use one exclusively.
* Collapsible/Hidden sections are used for the map and about sections since they have a significant amount of content and we don't need to see them at the same time.
* A popup is used for the URL change since we want to control the interaction until the operation is completed. It seemed more natural than another collapsible section.

#### Clicking on the map places a marker.
Whenever a user clicks on the map, the client should display a marker with latitude and longitude at that location.
We only maintain a single marker at this point displaying the most recently clicked location.

#### Clicking on the team name should tell me more about the team.
Whenever a user clicks the team name in the header, a collapsible section should appear under the header with information about the team.
The collapsible map should disappear so only the about or map are displayed.
A close button / icon in the top right corner of the about will close the about and return the map to display.
A simple toggle in state should be able to control this rendering.
The about page should contain the team name as a heading, but be otherwise blank in base. 

#### Clicking on the URL in the footer should let me change the server.
Whenever a user clicks on the URL a popup should open showing the team name, the URL in an input text box, and a Cancel button.
When the user modifies the URL, a Test button should appear and the server name should disappear.
When the Test button is clicked, it will attempt to connect to the server.
If not successful, nothing changes and the user may continue to make URL changes or click the Cancel button to return to the original sever (it shouldn't change).
If successful, the new server name should appear and a Save button should replace the Test button.
When the user clicks the Save button, the server connection should change and the popup closes, revealing the new servername and URL in the footer.


### Component Hierarchy
The component hierarchy for the base application depicted below shows the our top level App component with four children components.
* App renders the major components on the screen.
* Header renders an icon and a team name in the top banner.
* Footer renders the current server connection in the bottom footer.
* Atlas renders a map.
* About renders information about the team.

![base component hierarchy](./Architecture%20&%20Design/BaseComponentHierarchy.png)

We do not show the many ReactStrap components in this hierarchy, even though they will appear when you are debugging on the client.

### Class Diagram
The class diagram for the base application depicted below shows the basic structure of the web server application.

![class diagram](./Architecture%20&%20Design/BaseClassDiagram.png)

The classes in blue represent the classes specific to this application.  
* WebApplication processes command line parameters and creates MicroServer.
* MicroServer start a web server on the given port, configures the server for security, static files, and APIs for different types of requests, and processes the requests as they arrive.
* JSONValidator verifies a request is properly formatted before attempting to process it using JSON Schemas.
* RequestConfig is a specific request that allows the server to respond with its configuration to allow interoperability between clients and servers. 
* RequestHeader defines the basic components of all requests.

The classes in orange represent the external libraries used by the application.
Often there are several related classes but we've listed only one to simplify the diagram.
* GSON converts a JSON string into a Java object instance.
* Spark provides the necessary web support for our MicroServer.
* JSON provides libraries to manipulate JSON objects using the JSON Schema libraries.
* Logger provides a centralized logging facility used in all of the application classes.


# Sprint 1
![UI changes Sprint1](./Architecture%20&%20Design//Sprint%201/Sprint1uiChanges.png)

The following diagram represents changes made in the UI for sprint1, one of the primary changes we made was adding the about section which is a set of 4 cards, one for each teammember containing a image and short bio. The about section can be openned by clicking the team name header at the top of the page to open and close the about container with a slide up and down animation. There is also conveniently a close button at the bottom of the about page to prevent having to scroll back to the top of the page if the user would like to return to the home page.

Other notable changes in UI include adding our teamname to the header and footer, linking the CSS style to Colorado State University's official stylesheets and adding a server configuration prompt when the information icon in the footer is clicked.

# Sprint 2

![UI changes Sprint2](./Architecture%20&%20Design//Sprint%202/sprint2uichanges.png)

![Component changes Sprint1](./Architecture%20&%20Design//Sprint%202/Sprint2ComponentChanges.png)

![Server changes Sprint1](./Architecture%20&%20Design//Sprint%202/server-class-diagram-sprint2.png)

![More UI changes Sprint2](./Architecture%20&%20Design//Sprint%202/sprint2diagram.png)

# Sprint 3 
![Sprint 3 UI Design](./Architecture%20&%20Design//Sprint%203/sprint3UIdesign.png)

![Sprint 3 Map Shortlist](./Architecture%20&%20Design//Sprint%203/Sprint3DiagramMap.png)



# Sprint 4 

![Sprint 4 UI Design](./Architecture%20&%20Design//Sprint%204/sprint4UI.png)

![Sprint 4 Server Design](./Architecture%20&%20Design//Sprint%204/serverChanges.png)

![Sprint 4 Server Design](./Architecture%20&%20Design/Sprint%204/sprint4classdiagram.png)

![Sprint 4 Finished Diagram](./Architecture%20&%20Design/Sprint%204/sprint4DiagramStuff.png)


# Sprint 5

![Sprint 5 UI Design](./Architecture%20&%20Design//Sprint%205/Sprint5UIChanges.png)

### Server Class Diagram (no changes since sprint 4)
![Server Class Diagram](./Architecture%20&%20Design//Sprint%205/sprint5ServerClassDiagram.png)

### Client Component Heirarchy
![Sprint 5 Client Component Heirarchy](./Architecture%20&%20Design//Sprint%205/ClientClassHierarchySprint5.png)

### Sprint 5 UI Changes
![Sprint 5 MapLayout](./Architecture%20&%20Design//Sprint%205/MapLayout.png)
![Sprint 5 SearchBoxLayout](./Architecture%20&%20Design//Sprint%205/SearchBoxLayout.png)
