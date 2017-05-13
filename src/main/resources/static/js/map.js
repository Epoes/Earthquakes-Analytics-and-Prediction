

var italyView = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);

Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = italyView;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;


var earthquakes = undefined;


//Initialize the viewer widget with several custom options.
var viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    fullscreenButton : true,
    vrButton : false,
    homeButton : false,
    infoBox : true,
    sceneModePicker : true,

    //help info
    navigationHelpButton : false,
    navigationInstructionsInitiallyVisible : false,

    skyBox : undefined, //default sky

    //FPS
    useDefaultRenderLoop : true,
    targetFrameRate : 60,

    //scene options
    sceneMode : Cesium.SceneMode.SCENE3D,
    selectionIndicator : true,
    timeline : false,

    //credits:
    creditContainer : "info-menu-body",

    terrainExaggeration : 1,

    shadows : false,
    projectionPicker : false
});


function changeResolution(numb){
    viewer.resolutionScale = numb;
}

function changeFPS(numb){
    viewer.targetFrameRate = numb;
}


//remove fixed entity.
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);


//TODO: scene option. play with webGL options
const scene = viewer.scene;
scene.debugShowFramesPerSecond = true;
scene.fxaa = true;

//possible optimisation. maximumScreenSpaceError > best performance
scene.globe.maximumScreenSpaceError = 2;
scene.globe.tileCacheSize = 100;


const primitiveCollection = new Cesium.PointPrimitiveCollection();
primitiveCollection.blendOption = 1;
var points = scene.primitives.add(primitiveCollection);

var stdRequest = {
    count : 9950000,
    endTime : new Date(),
    startTime : new Date(),
    minMag : 2,
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

stdRequest.startTime.setDate(stdRequest.startTime.getDate() - 100);
var nextRequest;


$(document).ready(function () {
    nextRequest = copyObject(stdRequest);
    doRequest(stdRequest);


});



//TODO: this
function doMultiRequest(request, loadingCallBack){
    stdRequest = request;
    nextRequest = copyObject(stdRequest);
    doRequest(request, loadingCallBack);
}

function doRequest(request, callback){
    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/query?count=" + request.count + "&start_time="+ formatDateForQuery(request.startTime)
             + "&end_time=" + formatDateForQuery(request.endTime) + "&max_magnitude=" + request.maxMag
             + "&min_magnitude=" + request.minMag + "&min_depth=" + request.minDepth + "&max_depth=" + request.maxDepth
             + "&min_lat=" + request.minPoint.latitude + "&min_lng=" + request.minPoint.longitude
             + "&max_lat=" + request.maxPoint.latitude + "&max_lng=" + request.maxPoint.longitude,

        type: "GET",
        success: function (data, textStatus, jqXHR) {
            earthquakes = data;
            setUpDepth(earthquakes);
            setUpDateRange(earthquakes);
            sortByMagnitude(earthquakes);

            //pick control
            closeInfoBox();
            removeSelectedPoint();
            resetCameraRotationCenter();


            drawEarthquakes(earthquakes);

            if(timeLineMode){
                resetTimeLaps();
                setUpTimeLineView();
            }

            if(callback !== undefined){
                callback();
            }
        }
    });
}

var minimumTime = 30000;
var startTime;
var totalTime;

function changeTotalTime(time){
    pauseTimeLine();
    totalTime = time;
    currentTime = timePercent * totalTime;
    playTimeLine();
}

function getIndexFromTimes(minimumTime){
    for (var i = 0; i < possibleTimesInSeconds.length; i++){
        if(minimumTime < possibleTimesInSeconds[i]){
            return i;
        }
    }
}

function setUpTimeLineView(){
    $("#player").css("bottom", "25px");
    timeInterval = maxLongTime - minLongTime;
    resetLastPoint();
    closeInfoBox();
    hidePoints(0, earthquakes.length);
    sortByDate(earthquakes);

    var minimumTime = computeMinimumTime();
    var minimumIndex = getIndexFromTimes(minimumTime);
    totalTime = possibleTimesInSeconds[minimumIndex]*1000;



    setupTimeSlider(minLongTime, maxLongTime, totalTime);
    var msPassedPerSecond =  ((maxLongTime-minLongTime)/totalTime)*1000;
    console.log("total Animation Time In Seconds : " + totalTime/1000);
    console.log("real days time passed per second : " + msPassedPerSecond/(1000*60*60*24));
    console.log("earthquakes per second : " + earthquakes.length/(totalTime/1000));
    // playTimeLine();
}


function changeTimeLineCurrentTime(date){
    var realTimePercent = normalizeT(date, minLongTime, maxLongTime);
    currentTime = realTimePercent*totalTime;
    hidePoints(last, next);
    next = findIndexFromDate(date);
    last = next;
    globalCounter = 0;

}

function  findIndexFromDate(date){
    for(var i = 0; i < earthquakes.length; i++){
        if(earthquakes[i].origin.time > date){
            return i;
        }
    }

    return earthquakes.length;
}

//TODO: working on pick obj in pause

function pauseTimeLine(){
    if(play) {
        $("#play-button").show();
        $("#pause-button").hide();
        // singleClickAction = singleClickUnderlineEarthquake;
        // doubleClickAction = doubleClickHandler;
        pauseTime = new Date().getTime();
        clearInterval(timer);
        play = false;
    }
}

function playTimeLine(){
    if(!play) {
        $("#play-button").hide();
        $("#pause-button").show();
        singleClickAction = function(){};
        doubleClickAction = function(){};
        play = true;
        startTime = new Date().getTime() - currentTime;
        timer = setInterval(showTimeLine.bind(null, startTime, totalTime ), 16); //60fps
    }
}
var play = false;
var pauseTime = 0;
var timer;
var globalCounter = 0;
var next = 0;
var last = 0;
var currentTime = 0;
var timeInterval;
var timePercent;
var possibleTimesInSeconds = [30, 60, 120, 300, 600, 1200];

function showEarthquakes(currentTime){
    timePercent = normalizeT(currentTime, 0, totalTime);
    var realTimePassed = timePercent*(timeInterval) + minLongTime;
    setTimeSliderValue(realTimePassed, currentTime);

    var nextEarthquake = earthquakes[next];
    var nextPoint = nextEarthquake.primitivePoint;

    while(next < earthquakes.length && timePercent >= normalizeT(nextEarthquake.origin.time, minLongTime, maxLongTime)){
        nextPoint.translucencyByDistance = undefined;
        nextPoint.show = true;
        nextEarthquake.viewTime = currentTime;
        globalCounter++;
        next++;
        if(next < earthquakes.length){
            nextEarthquake = earthquakes[next];
            nextPoint = nextEarthquake.primitivePoint;
        }

    }
}

function animateEarthquakes(currentTime){

    for(var i = last; i < next; i++){
        var lastEarthquake = earthquakes[i];
        var lastPoint = lastEarthquake.primitivePoint;
        var earthquakeTime = 1000 * lastEarthquake.magnitude.magnitude;
        var viewTime = currentTime - lastEarthquake.viewTime;
        var showTime = earthquakeTime/4;

        //TODO: use a linkList
        if(viewTime > earthquakeTime){
            cancelPoint(last + (i-last));
            if(i == last) {
                last++;
                globalCounter--;
            }
        }else if(viewTime < showTime){
            showPoint(lastEarthquake, lastPoint, viewTime, 0,  showTime);
        }else if(viewTime > (earthquakeTime - showTime)){
            hidePoint(lastEarthquake, lastPoint, viewTime, (earthquakeTime - showTime), earthquakeTime);
        }

    }
}

function hidePoint(e, point, currentTime, startTime, totalTime){
    var timePercent = normalizeT(currentTime, startTime, totalTime);
    point.pixelSize = getPixelSize(e) * (1-timePercent);
}

function showPoint(e, point, currentTime, startTime, totalTime){
    var timePercent = normalizeT(currentTime, startTime, totalTime);
    point.pixelSize = getPixelSize(e) * timePercent;
};

function showTimeLine(startTime, totalTime){
    currentTime = new Date().getTime() - startTime;

    if(currentTime > totalTime){
        setTimeSliderValue(maxLongTime, totalTime);
        if(globalCounter == 0) {
            resetTimeLaps();
        }
    }else{
        showEarthquakes(currentTime);
    }

    animateEarthquakes(currentTime);
}



var bound = 1000;

function computeMinimumTime(){
    var maxEarthquakePerSecond;
    if(bound > earthquakes.length){
        maxEarthquakePerSecond = earthquakes.length
    }else{
        maxEarthquakePerSecond = bound;
    }
    return (earthquakes.length/maxEarthquakePerSecond);


}

function clearTimeLaps(){
    resetTimeLaps();
    restorePointsAfterTimeLine();
    $("#player").css("bottom", "-400px");
}

function resetTimeLaps(){
    clearInterval(timer);
    hidePoints(0, earthquakes.length);
    setTimeSliderValue(minLongTime);
    play = false;
    pauseTime = 0;
    globalCounter = 0;
    currentTime = 0;
    setTimeSliderValue(minLongTime, currentTime);
    next = 0;
    last = 0;
    currentTime = 0;
    $("#pause-button").hide();
    $("#play-button").show();
}

function cancelPoint(index){
    earthquakes[index].primitivePoint.show = false;
}

function restorePointsAfterTimeLine(){
        sortByMagnitude(earthquakes);
        singleClickAction = singleClickUnderlineEarthquake;
        doubleClickAction = doubleClickHandler;
        for (var i = 0; i < earthquakes.length; i++) {
            earthquakes[i].primitivePoint.translucencyByDistance =
                magnitudeNearFarScalar(earthquakes[i], i, earthquakes.length);
            earthquakes[i].primitivePoint.pixelSize = getPixelSize(earthquakes[i])
            earthquakes[i].primitivePoint.show = true;

        }

}


function hidePoints(begin, end){
    for(var i =begin; i < end; i++){
        earthquakes[i].primitivePoint.show = false;
    }
}






















