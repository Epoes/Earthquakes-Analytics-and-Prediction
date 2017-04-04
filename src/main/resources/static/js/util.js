function sortByDate(earthquakes) {
    return earthquakes.sort(function (a, b) {
        return a.origin.time - b.origin.time;
    });
}

function sortByDateRev(earthquakes) {
    return earthquakes.sort(function (a, b) {
        return b.origin.time - a.origin.time;
    });
}

function sortByMagnitude(earthquakes) {
    return earthquakes.sort(function (a, b) {
        return  a.magnitude.magnitude - b.magnitude.magnitude;
    });
}

function sortByMagnitudeRev(earthquakes) {
    return earthquakes.sort(function (a, b) {
        return  b.magnitude.magnitude - a.magnitude.magnitude;
    });
}

function sortByDepth(earthquakes) {
    return earthquakes.sort(function (a, b) {
        return  a.origin.depth - b.origin.depth;
    });
}

function sortByDepthRev(earthquakes) {
    return earthquakes.sort(function (a, b) {
        return  b.origin.depth - a.origin.depth;
    });
}




