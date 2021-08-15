# Sprint 4 - *t18* - *progRAMmers*

## Goal
### Shorter Trips!
## Sprint Leader
### Michael Bauers


## Definition of Done

* The version in `server/pom.xml` is `<version>4.0</version>`.
* The Product Increment release for `v4.0` created on GitHub.
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
* Epic #1: *V4 Protocol, Issue #294*
  * This epic implements the v4 protocol. This includes supporting the requests for Config, Distance, Find, and Trip. This new protocol adds some new elements to the requests including response and coordinates in places and response to trip as well as filters to config and narrow to find. 
* Epic #2: *Build a Trip, Issue #187*
  * This epic allows users to build a round trip from a given starting point. More functionality includes: Naming the trip, showing the trip on the map, saving the trip, loading a saved trip, showing total round trip distance.
* Epic #3: *Shorter, Issue #314*
  * This epic allows users to choose a shorter trip while still visiting all the same places. This will use heuristic optimization to improve large trips.
* Epic #4: *Filter Search, Issue #315*
  * This epic allows users to filter even further when searching for places so there is not a long list on the screen. This could include searching by region or country.


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *4* | *3* |
| Tasks |  *27*   | *39* | 
| Story Points |  *40*  | *53* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 11/2 | #199, #297, #298, #295, #299, #302, #244, #304 | #329, #335, #336, #338 | N/A | 
| 11/4 | #329, #335, #336, #338, #305, #317, #356, #358, #361, #362, #365 | #271, #308, #323, #225, #303, #300, #194 | N/A | 
| 11/9 | #194, #195, #225, #323, #387, #308, #394, #396, #377, #382, #390, #395  | #393, #398, #197, #303, #300, #309  | N/A | 
| 11/11 | #197, #198, #300, #303, #309, #318, #393 | #398, #307 | N/A |


## Review

### Epics done  
V4 Protocol, Build a Trip, Shorter

### Epics not done 
Filter Search 

### What went well
We kept up with good communication overall and worked as a team nicely.

### Problems encountered and resolutions
We had some arguments about what we should believe should be tasks as well as the priority of the tasks. We resolved these by each explaining our opinions and then deciding the best course of action to move forth with.

## Retrospective

### What we changed this sprint
We had people who worked on similar epics in the previous sprints work on those tasks in this sprint because they had the most knowledge and experience with those items. 
### What went well
We had better progress throughout the whole sprint meaning we did not feel as rushed towards the end to quickly finish what we had left. 
### Potential improvements
We had new additions to our code that did not work with what we already had implemented. This itself is not bad but we waited until after already implemented to voice the problem causing other people to fix changes that could have been avoided before the new addition.
### What we will change next time
Have a little more communication on how we are implementing our tasks instead of just who is completing the tasks.
