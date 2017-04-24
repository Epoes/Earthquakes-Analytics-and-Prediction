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

// function interpolate(a, b, t){
//     return (a + (b-a)*t);
// }

function interpolate(a, b, t){
    return (1 - t) * a + (t * b);
}

function normalizeT(value, min, max){
    return (value - min) / (max - min);
}

function addZeroToString(s){
    if(s.length === 1){
        s = "0" + s;
    }
    return s;

}

function formatDateForQuery(date){
    var year = date.getFullYear();
    var month = date.getMonth();
    month++;
    month = month + "";
    if(month.length === 1){
        month = "0" + month;
    }
    var day = date.getDate();
    day = day + "";
    if(day.length === 1){
        day = "0" + day;
    }
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    hour = hour + "";
    if(hour.length === 1){
        hour = "0" + hour;
    }
    min = min + "";
    if(min.length === 1){
        min = "0" + min;
    }
    sec = sec + "";
    if(sec.length === 1){
        sec = "0" + sec;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

function copyObject(obj) {
    return $.extend({}, obj);
}

var RGBToHex = function (r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase())
};

var computeColorComplement = function (first, second, third) {
    var hex;

    if (first !== undefined && second !== undefined && third !== undefined) {
        hex = RGBToHex(first * 255, second * 255, third * 255);
    } else if (first !== undefined && second === undefined && third === undefined) {
        hex = first;
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    if (hex === "FFFFFF" || hex === "ffffff") {
        return "#ff0000";
    }

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
};

var padZero = function (str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
};




