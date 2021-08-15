export function popupInfo(info) {
    let returnedInfo = info["name"] + " - ";
    returnedInfo += info["municipality"] ? info["municipality"] + ", " : "";
    returnedInfo += info["region"] ? info["region"] + ", ": "";
    returnedInfo += info["country"] ? info["country"]: "";
    return returnedInfo;
}