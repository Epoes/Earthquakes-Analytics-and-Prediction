var stdRequest = {
    count : 9950000,
    endTime : new Date(),
    startTime : new Date(),
    minMag : 3,
    maxMag : 9,
    minDepth : 0,
    maxDepth : 25000,
    minPoint : {
        longitude: 5.00,
        latitude: 35.00
    },
    maxPoint : {
        longitude: 20.00,
        latitude: 49.00
    }
};
let nextRequest;

function getLatestEarthquake(numbOfDayBack){
    stdRequest.startTime.setDate(stdRequest.startTime.getDate() - numbOfDayBack);
    nextRequest = copyObject(stdRequest);
    searchEarthquakes(stdRequest, function(){});
}

function searchEarthquakes(request, loadingCallBack){
    stdRequest = request;
    nextRequest = copyObject(stdRequest);
    var url = getUrlFromRequest(request);
    if(settings.intensityMode){
        removeAllIntensity();
    }

    doAjaxRequest(url,"GET", function(data, textStatus, jqXHR){
        afterEarthquakesRequest(data, textStatus, jqXHR);
        loadingCallBack();
    });
}

function findIntensityById(id, callback){
    var url = "http://" + window.location.host + "/api/earthquakes/intensity/" + id;
    doAjaxRequest(url, "GET", callback)
}

function afterIntensityRequest(intensity, textStatus, jqXHR){
    hideAllPoints();
    changeView("legend");
    let e = findEarthquakeByIntensityId(intensity.id);
    e.intensity = intensity;
    intensity.earthquake = e;
    selectedObjects.intensity = intensity;
    drawIntensity(intensity);
    flyTo(e.origin.latitude, e.origin.longitude, 300000)
}


function doAjaxRequest(url, type, successCallBack){
    $.ajax({
               url: url,
               type: type,
               success: successCallBack,
               error: function(){console.log("error")},

           });
}

function getUrlFromRequest(request){
    return "http://" + window.location.host + "/api/earthquakes/query?count=" + request.count + "&start_time="+ formatDateForQuery(request.startTime)
           + "&end_time=" + formatDateForQuery(request.endTime) + "&max_magnitude=" + request.maxMag
           + "&min_magnitude=" + request.minMag + "&min_depth=" + request.minDepth + "&max_depth=" + request.maxDepth
           + "&min_lat=" + request.minPoint.latitude + "&min_lng=" + request.minPoint.longitude
           + "&max_lat=" + request.maxPoint.latitude + "&max_lng=" + request.maxPoint.longitude;
}

