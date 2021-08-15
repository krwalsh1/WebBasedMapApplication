# Inspection - Team *T18* 
 
| Inspection | Details |
| ----- | ----- |
| Subject | *Discuss code Smells and Defects* |
| Meeting | *10/16/20, 11:30, Teams* |
| Checklist | *[Link to CheckList](https://github.com/csucs314f20/t18/blob/add-team-meeting-time/reports/checklist.md)* |

### Roles

| Name | Preparation Time |
| ---- | ---- |
| Jacob | 30min |
| Korbin | 30min |
| Alec | 30min |
| Michael | 30min |
| Chase| 30min |

### Problems found

| file:line | problem | hi/med/low | estimate | who found | github#  |
| --- | --- | :---: | :---: | :---: | --- |
| ServerSettings.js 103-117 | Duplication between functions | med | 2 | krwalsh1 | #225 |
| LocationHandler.js 10 | Unresolved function/parameter | med | 1 | krwalsh1 | #244 |
| RequestTrip.java:30 | RequestTrip(...) should be future proofed to support anywhere from 2-100+ destinations instead of just 3 | med | 3 | alecmoran7 | #228 |
| RequestFind.java | RequestFind(match, limit): When is it used? | low | 1 | petterle | *Resolved* |
| RequestTrip.java | RequestTrip method is the same as class name | med | 1 | petterle | *Resolved* |
| DistanceCalculator.java:6| Too Many Parameters | low | 1 | michaelbauers | #231 |
| About.js | Duplication of structure | low | 1 | michaelbauers | #243 |
| Atlas.js:28 | centerOfMap is set but never used | low | 1 | chasehoward85| #238 |
| Atlas.js:44 | markerCurrentLocationState is set to false then never used | low | 1 | chasehoward85 | #238 |
| Atlas.js:100 | Inline styling - against Dave's rules | med | 2 | chasehoward85 | #238 |
| Atlas.js:129 | sphericalLaw does not need to be used | low | 1 | chasehoward85 | #238 |
