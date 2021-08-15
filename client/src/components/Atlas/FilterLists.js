export function buildFilterList(filterOptions, testList) {
    for (let i in testList) {
        ++i;
        let filterSelect = '{"label": "' + testList[i-1] + '", "value": ' + i + ', "name": "' + testList[i-1] + '"}';
        filterOptions[i] = JSON.parse(filterSelect);
    }
    return filterOptions;
}
