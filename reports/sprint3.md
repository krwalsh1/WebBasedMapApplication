# Sprint #3 - t18 - progRAMmers

## Goal
### Build a trip!

## Sprint Leader: 
### *Korbin Walsh*


## Definition of Done

* The version in `server/pom.xml` is `<version>3.0</version>`.
* The Product Increment release for `v3.0` created on GitHub.
* The team's web application is deployed on the production server (`black-bottle.cs.colostate.edu`).
* The design document (`design.md`) is updated.
* The sprint document (`sprint.md`) is updated with scrums, completed metrics, review, and retrospective.


## Policies

### Mobile First Design
* Design for mobile, tablet, laptop, desktop in that order.
* Use ReactStrap and ReactLeaflet for a consistent user experience (no HTML, CSS, style, etc.).

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
* Epic 1: *V3 Protocol, Issue #183*
  * This epic implements verison 3 of the protocol. In addition to supporting the requests of Find, Distance and Config, we will be implementing the support for Trip. Trip will contain the distances between a series of geographic locations that form a complete round trip.
* Epic 2: *Find Places, Issue #119*
  * This epic will allow users to find places around the world to visit. A user will enter a location or name into a input box and will then recieve a shortlist of relevant places. The user will then be able to select one place from that list to which a pin will be dropped on the map for.
* Epic 3: *Build a Trip, Issue #187*
  * This epic allows users to build a round trip from a given starting point. More functionality includes: Naming the trip, showing the trip on the map, saving the trip, loading a saved trip, showing total round trip distance.

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | 3 | 2 |
| Tasks |  29   | 24 | 
| Story Points |  44  | 34 | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 10/9 | #190 |  #201, #167, #148 | Korbin had a covid scare | 
| 10/12 | N/A |  #201, #184, #185, #203, #206, #167, #148 | N/A | 
| 10/19 | #120, #148, #167, #181, #186, #203, #201, #205, #206, #212, #215, #209 | #181, #184, #185, #188, #193, #194, #195, #196, #197, #198, #199  | N/A | 
| 10/21 | #181, #182, #184, #185, #188, #193, #196, #210, #265, #277 | #225  | N/A | 


## Review

### Epics done  
Find Places, V3 Protocol
### Epics not done 
Build a Trip
### What went well
Communication and teamwork.
### Problems encountered and resolutions
We encountered a few problems when trying to fix our server responses as well as implementing a the new Trip type. We resolved this by getting together and working on potential fixes as a group using our shared knowledge rather than trying to lone wolf it. 

## Retrospective

### What we changed this sprint
We got new team members! So we tried to allow for implement more tasks in order to see if we could get more done with our additional members.
### What went well
We worked really well together. We were able to get together on potential issues and work together to solve them rather than just bouncing ideas off one another hoping to come to a resolution on our own.
### Potential improvements
Maybe a little more realistic outlook on what we can get done in the allotted time. We shot for the stars but ended up on the moon.
### What we will change next time
We will work on gauging our estimates a little more accurately for the next sprint so we can have more precise tasks.
