var startTime = 0;
var totalTime = 0;
var minimumTimeIndex = 0;
var play = false;
var timer;
var globalCounter = 0;
var next = 0;
var currentTime = 0;

var timePercent = 0;
var possibleTimesInSeconds = [30, 60, 120, 300, 600, 1200, 1800, 3599];
var dict = {};
var out = 0;
var bound = 1000; //max number of earthquakes per second.





function setUpTimeLineView(){
    generalEqInfo.timeInterval = generalEqInfo.maxLongTime - generalEqInfo.minLongTime;
    resetLastPoint();
    closeInfoBox();
    sortByDate(earthquakes);
    setTotalTime();
    var daysPerSeconds = getDaysPerSeconds();
    setupPlayer(generalEqInfo.minLongTime, generalEqInfo.maxLongTime, totalTime, daysPerSeconds);
    setTimeSliderValue(generalEqInfo.minLongTime, 0);
}

function pauseTimeLine(){
    if(play) {
        play = false;
        clearInterval(timer);
        switchPlayerBottom();
        setPointsView();
    }
}

function playTimeLine(){
    if(!play) {
        if(settings.timeLineMode === false){
            setUpTimeLineView();
            hideAllPoints();
            settings.timeLineMode = true;
        }
        if(settings.intensityMode) {
            cancelIntensity();
            hideAllPoints();
        }
        changeOnClickHandler("playerMode");
        play = true;
        switchPlayerBottom();
        resetLastPoint();
        resetCameraRotationCenter();
        closeInfoBox();
        startTime = new Date().getTime() - currentTime;
        timer = setInterval(showTimeLine.bind(null, startTime, totalTime ), 16); //60fps
    }
}

function playPause(){
    if(!play){
        playTimeLine();
    }else{
        pauseTimeLine();
    }
}

function showTimeLine(startTime, totalTime){
    currentTime = new Date().getTime() - startTime;
    if(currentTime > totalTime){
        setTimeSliderValue(generalEqInfo.maxLongTime, totalTime);
        if(globalCounter == 0) {
            clearTimeLaps();
            return;
        }
    }else{
        timePercent = computeTimePercent();
        updatePlayer(timePercent);
        showEarthquakes(currentTime, timePercent);
    }

    animateEarthquakes(currentTime);
}

function computeTimePercent(){
    return normalizeT(currentTime, 0, totalTime);
}

function updatePlayer(timePercent){
    var realTimePassed = timePercent * (generalEqInfo.timeInterval) + generalEqInfo.minLongTime;
    setTimeSliderValue(realTimePassed, currentTime);
}

function showEarthquakes(currentTime, timePercent) {
    var nextEarthquake = earthquakes[next];
    var nextPoint = nextEarthquake.primitivePoint;
    while(next < earthquakes.length && timePercent >= normalizeT(nextEarthquake.origin.time, generalEqInfo.minLongTime, generalEqInfo.maxLongTime)){
        if(isAllow(nextEarthquake)){
            nextPoint.translucencyByDistance = undefined;
            nextPoint.show = true;
            nextEarthquake.viewTime = currentTime;
            dict[nextEarthquake.id] = nextEarthquake;
            globalCounter++;
        }else{
            //TODO: debug!
            out++;
        }
        next++;
        if (next < earthquakes.length) {
            nextEarthquake = earthquakes[next];
            nextPoint = nextEarthquake.primitivePoint;
        }
    }
}

function isAllow(e){
    if(globalCounter < bound){
        return true;
    }
    else if(globalCounter > bound && e.magnitude.magnitude < generalEqInfo.minimumMagnitude + 1){
        return false;
    }else if(globalCounter > 1.5*bound && e.magnitude.magnitude < generalEqInfo.minimumMagnitude + 2){
        return false;
    }else if(globalCounter > 2*bound && e.magnitude.magnitude < generalEqInfo.minimumMagnitude + 3){
        return false;
    }
    return true;
}

function animateEarthquakes(currentTime){
    for(var key in dict){
        var lastEarthquake = dict[key];
        var lastPoint = lastEarthquake.primitivePoint;
        var earthquakeTime = 1000 * lastEarthquake.magnitude.magnitude;
        var viewTime = currentTime - lastEarthquake.viewTime;
        var showTime = earthquakeTime/4; //25% of view time

        if(viewTime > earthquakeTime){
            cancelPoint(lastEarthquake);
            globalCounter--;
            delete dict[key];
        }else if(viewTime < showTime){
            showPoint(lastEarthquake, lastPoint, viewTime, 0,  showTime);
        }else if(viewTime > (earthquakeTime - showTime)){
            hidePoint(lastEarthquake, lastPoint, viewTime, (earthquakeTime - showTime), earthquakeTime);
        }
    }
}

function cancelPoint(e){
    e.primitivePoint.show = false;
}

function showPoint(e, point, currentTime, startTime, totalTime){
    var timePercent = normalizeT(currentTime, startTime, totalTime);
    point.pixelSize = getPixelSize(e) * timePercent;
}

function hidePoint(e, point, currentTime, startTime, totalTime){
    var timePercent = normalizeT(currentTime, startTime, totalTime);
    point.pixelSize = getPixelSize(e) * (1-timePercent);
}

function changeTotalTime(){
    var isPlaying = false;
    if(play) {
        isPlaying = true;
        pauseTimeLine();
    }
    totalTime = nextTime(totalTime)*1000;
    var daysPerSeconds = getDaysPerSeconds();
    var newCurrentTime = timePercent * totalTime;
    updateEarthquakesViewTime(currentTime, newCurrentTime);
    currentTime = newCurrentTime;
    setMaxMinDate(generalEqInfo.minLongTime, generalEqInfo.maxLongTime, daysPerSeconds);
    setTotalTimeText(totalTime);

    if(isPlaying) {
        playTimeLine();
    }else{
        timePercent = computeTimePercent();
        updatePlayer(timePercent);
    }
}

function changeCurrentTime(date){
    var realTimePercent = normalizeT(date, generalEqInfo.minLongTime, generalEqInfo.maxLongTime);
    currentTime = realTimePercent*totalTime;
    resetLastPoint();
    resetCameraRotationCenter();
    hideSelectedPoints();
    dict = {};
    next = findIndexFromDate(date);
    globalCounter = 0;
}

function findIndexFromDate(date){
    for(var i = 0; i < earthquakes.length; i++){
        if(earthquakes[i].origin.time >= date){
            return i;
        }
    }

    return earthquakes.length;
}

function updateEarthquakesViewTime(currentTime, newCurrentTime){
    for(var key in dict) {
        var e = dict[key];
        e.viewTime =  newCurrentTime - (currentTime - e.viewTime);
    }
}

function getDaysPerSeconds(){
    var msPassedPerSecond =  (generalEqInfo.timeInterval/totalTime)*1000;
    return msPassedPerSecond/(86400000);
}



function setTotalTime(){
    var minimumTime = computeMinimumTime();
    minimumTimeIndex = getIndexFromTimes(minimumTime);
    if(totalTime < possibleTimesInSeconds[minimumTimeIndex] * 1000){
        totalTime = possibleTimesInSeconds[minimumTimeIndex] * 1000;
    }

}

function computeMinimumTime(){
    var maxEarthquakePerSecond;
    if(bound > earthquakes.length){
        maxEarthquakePerSecond = earthquakes.length
    }else{
        maxEarthquakePerSecond = bound;
    }
    return (earthquakes.length/maxEarthquakePerSecond);
}

function nextTime(time){
    for(var i =0; i<possibleTimesInSeconds.length; i++){
        if(time < possibleTimesInSeconds[i]*1000){
            return possibleTimesInSeconds[i];
        }
    }
    return possibleTimesInSeconds[minimumTimeIndex];
}

function getIndexFromTimes(minimumTime){
    for (var i = 0; i < possibleTimesInSeconds.length; i++){
        if(minimumTime < possibleTimesInSeconds[i]){
            return i;
        }
    }
}

function showPlayer(){
    $("#player").css("bottom", "25px");
    $(".legend-container").css("bottom", "-400px")
}

function hidePlayer(){
    $("#player").css("bottom", "-400px");
    $(".legend-container").css("bottom", "25px")
}

function switchPlayerBottom(){
    if(play) {
        $("#play-button").hide();
        $("#pause-button").show();
    }else{
        $("#play-button").show();
        $("#pause-button").hide();
    }
}

function clearTimeLaps(){
    resetTimeLaps();
    restorePointsAfterTimeLine();
    setPointsView();
    settings.timeLineMode = false;
}

function resetTimeLaps(){
    clearInterval(timer);
    resetLastPoint();
    resetCameraRotationCenter();
    hideAllPoints();
    setTimeSliderValue(generalEqInfo.minLongTime);
    dict = {};
    play = false;
    globalCounter = 0;
    currentTime = 0;
    setTimeSliderValue(generalEqInfo.minLongTime, currentTime);
    next = 0;
    currentTime = 0;
    switchPlayerBottom();
    startTime = 0;
    minimumTimeIndex = 0;
    // timeInterval = 0;
    timePercent = 0;
}

function restorePointsAfterTimeLine(){
    sortByMagnitude(earthquakes);
    settings.singleClickHandler = singleClickUnderlineEarthquake;
    // settings.doubleClickHandler = doubleClickHandler;
    for (var i = 0; i < earthquakes.length; i++) {
        earthquakes[i].primitivePoint.translucencyByDistance =
            magnitudeNearFarScalar(earthquakes[i], i, earthquakes.length);
        earthquakes[i].primitivePoint.pixelSize = getPixelSize(earthquakes[i]);
        earthquakes[i].primitivePoint.show = true;
    }
}

function hideSelectedPoints(){
    for(var key in dict){
        dict[key].primitivePoint.show = false;
    }
}