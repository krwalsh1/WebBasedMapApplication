# Inspection - Team *T18* 
 
| Inspection | Details |
| ----- | ----- |
| Subject | *Atlas.js* |
| Meeting | *11/20/20, 11:00, Teams* |
| Checklist | *[Link to CheckList](https://github.com/csucs314f20/t18/blob/add-team-meeting-time/reports/checklist.md)* |

### Roles

| Name | Preparation Time |
| ---- | ---- |
| Chase | 20min |
| Alec | 20min |
| Michael | 20min |
| petterle | 15min |
| krwalsh1 | 20min |


### Problems found

| file:line | problem | hi/med/low | who found | github# |
| --- | --- | :---: | :---: | --- |
| Atlas.js:103-108 | if statements look to be duplicated and may not need to be used | low | ch85 |  |
| Atlas.js:117 | testResponse variable may be able to be removed | low | ch85 |  |
| Atlas.js:168 | openFindOptions state causes UI problems | high | ch85 |  |
| Atlas.js:525 | success function may have different implementation that doesn't require a function | med | ch85 |  |
| Atlas.js:124-126 | Unnecessary conversion of JSON objects to strings for extracting data, in this specific case just use newString = testplaces[i].name; instead | med | alecmoran7 | |
| Atlas.js:505-518 | distance and find have similar error checking, could be merged into one to save space | low | mbauers | #505 |
| Atlas.js:244 | singleLocationTrip is an obsolete state variable | med | petterle | #506 |
| Atlas.js:510 | dist probably shouldn't be a state variable | med | petterle | #506 |
| Atlas.js:179 | tripLinesOptimized appears to be redundent with allTripMarkers | low | petterle | #506 |
| Atlas.js:138 | searchTerm appears to be a duplication of locationResults | low | petterle | #506 |
| Atlas.js:290 - 340 | render is an absolutely monstorous function. Could probably outsource some of the code to cut down the size | med | krwalsh1 | #511 |
| Atlas.js:244 - 252 | handleCountryChange and handleTypeChange are very similar functions. Could cut down on duplication if dealt with | med | krwalsh1 | #510  |


