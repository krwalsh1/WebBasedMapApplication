import './jestConfig/enzyme.config';

import React from 'react';

import {popupInfo} from "../src/components/Atlas/popupInfo";

const info1 = {"name": "Fort Collins Loveland Municipal Airport", "municipality": "Fort Collins/Loveland", "region": "Colorado", "country": "United States"};
const info2 = {"name": "Fort Collins Downtown Airport", "municipality": null, "region": "Colorado", "country": "United States"};
const info3 = {"name": "Fake Airport", "municipality": null, "region": null, "country": null}

function testFullInfoString() {
    let expectedText = "Fort Collins Loveland Municipal Airport - Fort Collins/Loveland, Colorado, United States";

    let returnedText = popupInfo(info1);

    expect(returnedText).toEqual(expectedText);
}
test("Testing full popup info", testFullInfoString);

function testMissingInfoString() {
    let expectedText = "Fort Collins Downtown Airport - Colorado, United States";

    let returnedText = popupInfo(info2);

    expect(returnedText).toEqual(expectedText);
}
test("Testing missing property in popup info", testMissingInfoString);

function testNameOnly() {
    let expectedText = "Fake Airport - ";

    let returnedText = popupInfo(info3);

    expect(returnedText).toEqual(expectedText);
}
test("Test only name in popup info", testNameOnly);
