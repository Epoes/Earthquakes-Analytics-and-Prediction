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

function isANumb(text){
    const regex = /^[+-]?\d+(\.\d+)?$/;
    return regex.test(text)
}

/*

 sizeof.js

 A function to calculate the approximate memory usage of objects

 Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
 the terms of the CC0 1.0 Universal legal code:

 http://creativecommons.org/publicdomain/zero/1.0/legalcode

 */

/* Returns the approximate memory usage, in bytes, of the specified object. The
 * parameter is:
 *
 * object - the object whose size should be determined
 */
function sizeof(object){

    // initialise the list of objects and size
    var objects = [object];
    var size    = 0;

    // loop over the objects
    for (var index = 0; index < objects.length; index ++){

        // determine the type of the object
        switch (typeof objects[index]){

            // the object is a boolean
            case 'boolean': size += 4; break;

            // the object is a number
            case 'number': size += 8; break;

            // the object is a string
            case 'string': size += 2 * objects[index].length; break;

            // the object is a generic object
            case 'object':

                // if the object is not an array, add the sizes of the keys
                if (Object.prototype.toString.call(objects[index]) != '[object Array]'){
                    for (var key in objects[index]) size += 2 * key.length;
                }

                // loop over the keys
                for (var key in objects[index]){

                    // determine whether the value has already been processed
                    var processed = false;
                    for (var search = 0; search < objects.length; search ++){
                        if (objects[search] === objects[index][key]){
                            processed = true;
                            break;
                        }
                    }

                    // queue the value to be processed if appropriate
                    if (!processed) objects.push(objects[index][key]);

                }

        }

    }

    // return the calculated size
    return size;

}

function formatDateForList(date){
    var year = date.getFullYear();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var month =  date.getMonth();
    var monthToString = monthNames[month]
    var day = date.getDate() + "";
    day = addZeroToString(day);
    var hours = date.getHours() + "";
    hours = addZeroToString(hours);
    var minutes = date.getMinutes() + "";
    minutes = addZeroToString(minutes);
    var seconds =date.getSeconds() + "";
    seconds = addZeroToString(seconds);

    return day + " " + monthToString + " " + year + " at " + hours + "h" +minutes + "m" + seconds + "s";
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function htmlbodyHeightUpdate(){
    var height3 = $( window ).height()
    var height1 = $('.nav').height()+50
    height2 = $('.main').height()
    if(height2 > height3){
        $('html').height(Math.max(height1,height3,height2)+10);
        $('body').height(Math.max(height1,height3,height2)+10);
    }
    else
    {
        $('html').height(Math.max(height1,height3,height2));
        $('body').height(Math.max(height1,height3,height2));
    }

}



