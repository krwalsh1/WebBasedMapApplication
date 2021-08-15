# Sprint 2 - *t18* - *progRAMmers*

## Goal
### Show me the distance

## Sprint Leader: 
### Jacob Petterle

## Definition of Done

* The version in `server/pom.xml` is `<version>2.0</version>`.
* The Product Increment release for `v2.0` created on GitHub.
* The team's web application is deployed on the production server (`black-bottle.cs.colostate.edu`).
* The design document (`design.md`) is updated.
* The sprint document (`sprint.md`) is updated with scrums, completed metrics, review, and retrospective.

## Policies
* Github Etiquette

### Mobile First Design
* Design for mobile, tablet, laptop, desktop in that order.
* Use ReactStrap for a consistent user experience (no HTML, CSS, style, etc.).

### Clean Code
* Code Climate maintainability of A or B.
* Minimize code smells and duplication.

### Test Driven Development
* Write tests before code.
* Unit tests are fully automated.

### Processes
* Master is never broken. 
* All pull request builds and tests for Master are successful on Travis-CI.
* All dependencies managed using Maven, npm, and WebPack.
* GitHub etiquette is followed always.


## Planned Epics
* Epic 1: *v2 Protocol, Issue #109*
  * This epic implements the version 2 protocol which will fetch different protocol objects in a JSON format. In addition to the original protocol data of type config, new data of types distance and find will be introduced. These object types will prove invaluable when attempting to find specific locations on the map. In order to fetch the data in a JSON format, a HTTP post request will need to be sent and the correct status code caught in order to report useful data to the user.
 * Epic 2: *Find Distance, Issue #114*
    * This epic allows users to find the distance between two different locations on the map. The user will enter their data into a provided text box, which will then be saved by the client. With the relevant data, the app will calculate the distance and return it in miles while drawing a line between the two locations. 
 * Epic 3: *Where is, Issue #39*
    * This epic will allow the user to see a location on the map by plugging in latitude + longitude. The app will convert the user-provided latitude + longitude into readble data that will re-center the map onto the desired location.
 * Epic 4: *Find Places, Issue #119*
    * This epic will let users find locations and places around the world. The user will enter their information on their selected location, and a shortlist of relevant locations will appear allowing the user to select one. The map will then reframe to that location.
 * Epic 5: *Where am I?, Issue #37*
    * This epic allows the user to see their current location by placing a distinct marker on the map. This allows the user to be able to distinguish their current location from others.
  * Epic 6: *Feeling lucky, Issue #127*
    * This epic suggests a random place for the user to visit. After clicking on a "feeling lucky" prompt, the map will be recentered on the selected random location.
 
 
## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | 6 | 3 |
| Tasks |  18   | 9 | 
| Story Points |  35  | 19 | 

For this sprint, we think we will succeed in getting a majority if not all of the planned epics done before the milestone is complete. Based on our performance last sprint, where we were able to accomplish all of our tasks in a timely manner, we believe that as long as we keep our solid sense of communication with one another we should make ample progress. That said, the last sprint was more of a "setting up" or "introduction" where as this sprint dives into a more technical side, as described by our layout of the epics. It's safe to say that while we are optimistic of our ability to get work done, it's not out of the realm of possiblity that this sprint will take a significant more time than the last.


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *9/16/20* | *Tasks: 0, Story Points: 0* | *Tasks: 0, Story Points: 0* |  | 
| *9/18/20* | *Tasks: 0, Story Points: 0* | *Tasks: 0, Story Points: 11; #38, #110, #132, #111, #113, #131* | Scott's Machine | 
| *9/21/20* | *Tasks: 2, Story Points: 4* | *Tasks: 4, Story Points: 7; #110, #132, #111, #113* | Scott's machine, will be resolved Wednesday | 
| *9/23/20* | *Tasks: 4, Story Points: 8* | *Tasks: 3,Story Points: 4; #110, #115, #113* | Scott withdrawing from course | 
| *9/25/20* | *Tasks: 6, Story Points: 11* | *Tasks: 3,Story Points: 4; #110, #115, #112* | | 
| *9/28/20* | *Tasks: 6, Story Points: 11* | *Tasks: 3,Story Points: 4; #110, #115, #112* | | 
| *9/30/20* | *Tasks: 9, Story Points: 14* | *Tasks: 2,Story Points: 5; #112, #117* | | 

## Review

### Epics done  
v2 Protocol, Where am I?, Find Distance
### Epics not done 
Distance Units, Feeling Lucky, Find Places, Where is?
### What went well
Once again, teamwork was really well done between our team-members. We were able to have a constant line with one another through our struggles and achievements throughout the sprint. This was able to expediate our decision making and process. 
### Problems encountered and resolutions
For starters, we lost one of our team members around halfway through the sprint. This forced us to change our thinking and recalculate exactly what we could get done before the deadline now that our group was down to just three. We were able to resolve this by meeting with one another shortly after the problem started and shifting our focus on the bigger goals this sprint focused on.
## Retrospective

### What we changed this sprint
We tried to start our tasks a little earlier this time in order to allow for more time to debug and deal with potential problems.
### What went well
Communication with one another and our ability to handle problems that popped up.
### Potential improvements
Better organization of our tasks and epics for the next sprint for better clarity.
### What we will change next time
A better allocation of time on the more important tasks and thoroughly vetting out the requirements of the epics when creating the tasks will prove useful.
