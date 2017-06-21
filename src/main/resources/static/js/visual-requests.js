var centerBoundings = [43.961401, 14.452927, 42.424652, 10.050827];
var italyBoundings = [48.00, 35.00, 19.00, 5.00];

var stdRequest = {
    count : 100000,
    endTime : new Date(),
    startTime : new Date("1985-01-01"),
    minMag : 3,
    maxMag : 9,
    minDepth : 0,
    maxDepth : 30000,
    minPoint : {
        longitude: italyBoundings[3],
        latitude: italyBoundings[2]
    },
    maxPoint : {
        longitude: italyBoundings[1],
        latitude: italyBoundings[0]
    }
};


function doItalyRequest(objects, maxLat, minLat, maxLon, minLon){
    if(objects.length != 0 && elevations.length != 0){
        return;
    }
    var url;
    if(maxLat === undefined){
        url = "http://" + window.location.host + "/api/elevations/query?&minele=-4"
    } else{
        url = "http://" + window.location.host + "/api/elevations/query?maxlat=" + maxLat + "&minlat=" + minLat + "&maxlon=" + maxLon + "&minlon=" + minLon + "&minele=-4"
    }
    $.ajax({
        // url: "http://" + window.location.host + "/api/elevations/query?minele=-4200",
        url: url,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            switch(maxLat){
                case 48:
                    northElevations = data;
                    for(var i = 0; i < northElevations.length; ++i){elevations.push(northElevations[i]);}
                    drawItaly(northElevations);
                    break;
                case 44:
                    centreElevations = data;
                    for(var i = 0; i < centreElevations.length; ++i){elevations.push(centreElevations[i]);}
                    drawItaly(centreElevations);
                    break;
                case 41.7:
                    southElevations = data;
                    for(var i = 0; i < southElevations.length; ++i){elevations.push(southElevations[i]);}
                    drawItaly(southElevations);
                    break;
                default:
                    elevations = data;
                    drawItaly(elevations);
            }

        }
    });
}

function doRequest(request){
    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/query?count=" + request.count + "&start_time="+ formatDateForQuery(request.startTime)
        + "&end_time=" + formatDateForQuery(request.endTime) + "&max_magnitude=" + request.maxMag
        + "&min_magnitude=" + request.minMag + "&min_depth=" + request.minDepth + "&max_depth=" + request.maxDepth
        + "&min_lat=" + request.minPoint.latitude + "&min_lng=" + request.minPoint.longitude
        + "&max_lat=" + request.maxPoint.latitude + "&max_lng=" + request.maxPoint.longitude,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            epicentres = data;
            drawEarthquake(epicentres);
            // getStationMagnitudes(epicentres);
            // getArrivals(epicentres);
        }
    })
}

function getStationMagnitudes(objects, epicentre) {
    var min_magnitude = 2.5;
    var max_magnitude = 8;
    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/stationMagnitudes/query?earthquake_id=" + epicentre.id + "&min_magnitude=" + min_magnitude + "&max_magnitude=" + max_magnitude,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            stationMagnitudes = data;
            startTime = new Date().getTime();
            currentTime = startTime;
        }
    })
}

function getArrivals(objects, epicentres) {
    var phase = "";
    if(objects.length != 0){
        return;
    }
    for(var i = 0; i < epicentres.length; ++i){
        var earthquake = epicentres[i];
        $.ajax({
            url: "http://" + window.location.host + "/api/earthquakes/arrivals/query?earthquake_id=1895389&phase=" + phase,
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                arrivals = data
                drawArrivals(data);
            }
        })
    }
}

function requestStations(){
    $.ajax({
        url: "http://" + window.location.host + "/api/stations/query",
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            stations = data;
            drawStation(data);
        }
    })
}

