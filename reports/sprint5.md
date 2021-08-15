# Sprint 5 - *t18* - *progRAMmers*

## Goal
### User Experience

## Sprint Leader
### *Chase Howard*


## Definition of Done

* The version in `server/pom.xml` is `<version>5.0</version>`.
* The Product Increment release for `v5.0` created on GitHub.
* The team's web application is deployed on the production server (`black-bottle.cs.colostate.edu`).
* The design document (`design.md`) is updated.
* The sprint document (`sprint.md`) is updated with scrums, completed metrics, review, and retrospective.


## Policies

### Mobile First Design
* Design for mobile, tablet, laptop, desktop in that order.
* Use ReactStrap and ReactLeaflet for a consistent user experience (no HTML, CSS, style=, etc.).

### Clean Code
* Technical Debt Ratio less than 5% (A).
* Minimize code smells and duplication.

### Test Driven Development
* Write tests before code.
* Unit tests are fully automated.
* Code coverage greater than 70%.

### Processes
* Master is never broken. 
* All pull request builds and tests are successful on Travis-CI.
* All dependencies managed using Maven, npm, and WebPack.
* GitHub etiquette is followed always.


## Planned Epics
- Epic #1: *Shorter, Issue #314*
  - This epic allows users to choose a shorter trip while still visiting all the same places. This will use heuristic optimization to improve large trips.
- Epic #2: *Filter Search, Issue #315*
  - This epic allows users to filter even further when searching for places so there is not a long list on the screen. This could include searching by region or country.
- Epic #3: *User Experience, Issue #440*
  - This epic allows us to focus on what the user should be able to do. We will be working on making our interface as simple as possible for users.
- Epic #4: *File Formats, Issue #447*
  - This epic allows users to pick a format for their trip file to be in. We will allow for .json, .csv, .kml, and .svg extensions.
- Epic #5: *Place Details, Issue #455*
  - This epic will allow users to get information on any place on the map. When they click to drop a marker, information about that place will popup, which will include the region
- Epic #6: *Modify Trip, Issue #459*
  - This epic will allow users to change the ordering of their trip. We will allow them to reorder it however they would like and change the drawn lines accordingly
- Epic #7: *Where is?, Issue #465*
  - This epic will allow users to search for a location using the place's coordinates. These places will have the same info given with *Place Details*
- Epic #8: *Feeling Lucky?, Issue #466*
  - This epic allows users to have a random place suggested for them if they want. The place will pop up on the map and the user will be able to add it to their trip.


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *8* | *7* |
| Tasks |  *48*   | *84* | 
| Story Points |  *64*  | *100* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *11/18/20* | *#433, #441, #470* | *#437, #445, #426, #307* | n/a | 
| *11/20/20* | *#492, #449, #453, #499, #445, #437, #476, #478, #483, #426, #434* | *#435, #307, #448, #504* | n/a |
| *12/02/20* | *#515, #448, #435, #504, #480, #522, #523, #481, #527, #529, #531, #532, #534, #538, #505, #450, #454, #477, #479, #484, #414, #461, #552, #558* | *#517, #482, #451, #452, #464, #506, #511, #547, #548, #550* | Korbin went back home and had both computer and internet problems. He was unable to come back to Fort Collins so his options were limited |
| *12/07/20* | *#464, #482, #550, #517, #439, #547, #566, #567, #511, #569* | *#475, #451, #452, #506, #510* | n/a |
| *12/09/20* | *#475, #571, #576, #581, #452, #580, #573, #584, #475, #586, #589, #592, #582, #596* | *#456, #457, #458, #510, #438, #594, #451* | n/a |


## Review

### Epics done
- Shorter
- Feeling Lucky?
- Filter Search
- Where is?
- Place Details
- File Formats
- User Experience


### Epics not done 
- Modify Trip

### What went well
We were able to continously work on both tasks and Code Climate issues during the entire sprint. Our Code Climate issues were reduced by quite a bit while we worked on making our user interface better.

### Problems encountered and resolutions
We had problems finding ways to have cleaner code but as we learned what needed to happen we were able to implement them. We still have issues with how clean our code really is, however this was not a problem for us being able to read it because of how much time we spent working on all of our code.


## Retrospective

### What we changed this sprint
One of our biggest changes was focusing more on Code Climate issues than we had on past sprints. We also changed what all we included in our initial plan so we had a better idea of what we needed to get done from the start.

### What went well
We continously worked, including over fall break, and got a lot done. We found issues in different spots in our code as we worked and had great communication on what needed to be changed so it was no longer an issue. Because we focused on Code Climate more, we were able to make changes while we were implementing new things on our user interface.

### Potential improvements
Although we focused more on Code Climate this sprint, we were unable to get up to where we need to so we would need to work on Code Climate issues even more. We could have also used our dev servers more on devops to show off what we were changing and if we added to someone else's pull, made sure our changes are something the team can see without having to run it locally.

### What we will change next time
Next time we would focus more on Code Climate at the beginning then get new features implemented instead of working on only one or both at the same time. We would also make sure everyone on the team knew what we were doing instead of adding a task for it after we already changed it so people are not doing the same thing differently and overriding someone else's work
