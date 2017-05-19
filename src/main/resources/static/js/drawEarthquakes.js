const green = [0.0,1.0,0.0];
const yellow = [1.0,1.0,0.0];
const red = [1.0,0.0,0.0];
const orange =[1.0, 0.647, 0];

var minimumMagnitude = 0;

function drawEarthquakes(earthquakes) {

    minimumMagnitude = earthquakes[0].magnitude.magnitude;
    var difference = earthquakes.length - points.length;
    var count;
    var isEnough;

    //more points then needed
    if(difference < 0){
        count =  earthquakes.length;
        isEnough = true;
    }else{
        count = points.length;
        isEnough = false;
    }
    var i;
    for (i = 0; i < count; ++i) {
        resetPoint(earthquakes[i], points.get(i), i);
    }

    if(isEnough) {
        cancelPointsFrom(i, points);
    }else{
        addPointFrom(i, earthquakes);
    }
    selectedPoint = addSelectedPoint();

}

function initPoint(earthquake, index){
    return {
        position: getCartesianPosition(earthquake),
        id : earthquake,
        color: getCesiumColor(earthquake),
        pixelSize: getPixelSize(earthquake),
        scaleByDistance: getScaleByDistance(),
        translucencyByDistance: magnitudeNearFarScalar(earthquake, index, earthquakes.length)
    };
}

function resetPoint(earthquake, point, index){
    earthquake.primitivePoint = point;
    point.position = getCartesianPosition(earthquake);
    point.id = earthquake;
    point.color =  getCesiumColor(earthquake);
    point.pixelSize =  getPixelSize(earthquake);
    point.translucencyByDistance =  magnitudeNearFarScalar(earthquake, index, earthquakes.length);
    point.show = true;
}

function cancelPointsFrom(idx, pointsList) {
    for (idx; idx < pointsList.length; ++idx) {
        //TODO: something

        // points.remove(point);
        points.get(idx).show = false;
    }
}

function addPointFrom(idx, earthquakeList){
    for (idx; idx < earthquakeList.length; ++idx) {
        points.add(initPoint(earthquakeList[idx], idx));
        earthquakeList[idx].primitivePoint = points.get(idx);
    }

}

function getCesiumColor(e){
    return new Cesium.Color(selectedColorInterpolation(0, e),
                            selectedColorInterpolation(1, e),
                            selectedColorInterpolation(2, e), 1);
}

function interpolateColorByTime(inx, e){
    var time = e.origin.time;
    if(time <= (minLongTime+step)){
        return interpolate(green[inx], yellow[inx], normalizeT(time, minLongTime, minLongTime+step));
    } else if(time <= (minLongTime+ (2*step))){
        return interpolate(yellow[inx], orange[inx], normalizeT(time, minLongTime+step, minLongTime + (2*step)));
    }else {
        return interpolate(orange[inx], red[inx], normalizeT(time, minLongTime+(2*step), maxLongTime));
    }

}

function interpolateColorByDepth(inx, e){
    var depth = e.origin.depth;
    if(depth <= (minDepth+depthStep)){
        return interpolate(green[inx], yellow[inx], normalizeT(depth, minDepth, minDepth+depthStep));
    } else if(depth <= (minDepth+ (2*depthStep))){
        return interpolate(yellow[inx], orange[inx], normalizeT(depth, minDepth+depthStep, minDepth + (2*depthStep)));
    }else {
        return interpolate(orange[inx], red[inx], normalizeT(depth, minDepth+(2*depthStep), maxDepth));
    }

}


function interpolateColorByMagnitude(inx, e){
    var magnitude = e.magnitude.magnitude;
    if(magnitude <= 3){
        return interpolate(green[inx], yellow[inx], normalizeT(magnitude, 0, 3));
    } else if(magnitude <= 6){
        return interpolate(yellow[inx], red[inx], normalizeT(magnitude, 3, 6));
    }else {
        return red[inx];
    }

}

function getPixelSize(e) {
    const minimum = 5;
    const maximum = 35;
    const maxMagnitude = 10;
    var magnitude = e.magnitude.magnitude;
    return (minimum + (maximum - minimum) * (magnitude / maxMagnitude));
}

const defaultScaleByDistance = new Cesium.NearFarScalar(0, 10, 1.5e4, 1);
function getScaleByDistance() {
    return defaultScaleByDistance;
}

function magnitudeNearFarScalar(earthquake, index, count) {
    var magnitude = earthquake.magnitude.magnitude;
    return getBestPerformanceNearFarScalar(magnitude, index, count);
}

//TODO: review
function getBestPerformanceNearFarScalar(magnitude, index, count){
    if(index > count - 400) {
        return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
    }else if(index > count - 6600){
        return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 3e6 * (magnitude), 0.0);
    }else if (index > count - 85000){
        return new Cesium.NearFarScalar(interpolate(1.5e4, 4.5e4, normalizeT(magnitude, 2, 3)), 0.9, interpolate(3e5, 9e5, (magnitude - 2)), 0.0);

    }

    return new Cesium.NearFarScalar(interpolate(1.5e3, 5e3, normalizeT(magnitude, 0, 2)), 0.9, interpolate(1e4, 5e4, (magnitude/2)), 0.0);
}

var maxLongTime;
var minLongTime;
var step;

function setUpDateRange(earthquakes){
    if(earthquakes.length > 0 ) {
        maxLongTime = earthquakes[0].origin.time;
        minLongTime = earthquakes[earthquakes.length - 1].origin.time;
        timeInterval = maxLongTime - minLongTime;
        step = timeInterval / 3;
    }
}

var minDepth;
var maxDepth;
var depthInterval;
var depthStep;
function setUpDepth(earthquakes){
    minDepth = 900000;
    maxDepth = -1000;

    for( var i = 0; i < earthquakes.length; i++){
        var e = earthquakes[i];
        if(e.origin.depth > maxDepth){
            maxDepth = e.origin.depth;
        }

        if(e.origin.depth < minDepth){
            minDepth = e.origin.depth;
        }
    }

    depthInterval = maxDepth - minDepth;
    depthStep = depthInterval/3;
    if(depthStep == 0){
        depthStep = 0.1;
    }

}

function setCaptionByMagnitude() {
    var i = 0;
    $('#color1').children().each(function () {
        $(this).text(i + "");
        if (i > 0) {
            $(this).css("left", 16.66 *i + "%");
            $(this).css("transform","translate(-50%, 0%)");
        }
        i++;
    });
}

function setCaptionByDepth() {
    var i = 0;
    var step;
    var precision = 0;

    if(depthInterval == 0){
        step = 1000;
    }else {
        step = depthInterval / 6;
        if(step < 1000){
            precision = 1;
        }
    }
    $('#color1').children().each(function () {
        var depth = (minDepth + (step * i))/1000;
        $(this).text((round(depth, precision)) + " km");
        $(this).css("left", 16.66 * i + "%");
        $(this).css("transform","translate(-50%, 0%)");
        i++;
    });
}

const msPerDay = 86400000;
function setCaptionByDate() {

    var legnth = 4;
    var step = timeInterval/legnth;
    var dateFormat = mediumDateFormat;
    if (timeInterval <= 2*msPerDay){
        dateFormat = "h:mm a"
    }else if(timeInterval <= legnth*msPerDay){
        dateFormat = "h a, MMM Do"
    }else if(timeInterval <= 366*msPerDay){
        dateFormat = mediumDateFormat;
    }else if(timeInterval <= 2920*msPerDay){ //8 years
        dateFormat = "MMM YYYY"
    }else{
        dateFormat = "YYYY";
    }
    var children = $('#color1').children();
    console.log(children);

    $(children[0]).text(moment(minLongTime).format(mediumDateFormat));
    $(children[4]).text(moment(maxLongTime).format(mediumDateFormat));


    $(children[0]).css("left","0%");
    $(children[0]).css("transform","translate(-35%, 0%)");
    $(children[4]).css("left","100%");
    $(children[4]).css("transform","translate(-65%, 0%)");


    var i = 1;
    children.slice(1,4).each(function () {
        var date = minLongTime + (step * i);
        $(this).text(moment(date).format(dateFormat));
        $(this).css("left", 25 * i + "%");
        i++;
    });

    children.slice(5,7).each(function () {
        $(this).text("");
    });

}


function get3dPosition(e){
    return Cesium.Cartesian3.fromDegrees(e.origin.longitude, e.origin.latitude, (maxDepth - e.origin.depth));
}

function get2dPosition(e){
    return Cesium.Cartesian3.fromDegrees(e.origin.longitude, e.origin.latitude, e.magnitude.magnitude);
}

//settings
var selectedColorInterpolation = interpolateColorByMagnitude;
var setCaption = setCaptionByMagnitude;
var getCartesianPosition = get2dPosition;
var doubleClickHandler = doubleClickHandler2d;

var pickedPoint = undefined;
var pickedEarthquake = undefined;
var selectedPoint = undefined;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
var singleClickAction = singleClickUnderlineEarthquake;

//Single click
handler.setInputAction(function (click) {
    singleClickAction(click);

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

function singleClickUnderlineEarthquake(click){
    resetCameraRotationCenter();
    closeBarMenu();
    var pickedObject = viewer.scene.pick(click.position);
    //click on nothing
    if(pickedObject === undefined){
        resetLastPoint();
        return;
    }
    //click on the same object
    if(pickedPoint !== undefined && pickedObject.primitive.id === pickedEarthquake){
        showInfoBox(pickedEarthquake);
        return;
    }
    //click on other object
    resetLastPoint();
    if(pickedObject !== undefined) {
        switchUnderlinePoint(pickedObject);
        showInfoBox(pickedEarthquake);
    }

}

function switchUnderlinePoint(pickedObject){
        pickedEarthquake = pickedObject.id;
        pickedPoint = pickedObject;
        underLinePoint();
}
function resetLastPoint(){
    if(pickedPoint !== undefined) {
        pickedPoint.primitive.show = true;
        selectedPoint.show = false;
        pickedPoint = undefined;
        pickedEarthquake = undefined;
    }
}


function underLinePoint(){
    if(pickedPoint !== undefined){
        clonePoint(pickedPoint.primitive, selectedPoint);
        pickedPoint.primitive.show = false;
        selectedPoint.show = true;
        selectedPoint.translucencyByDistance = undefined;
        selectedPoint.outlineColor = Cesium.Color.fromCssColorString(computeColorComplement(selectedPoint.color.red, selectedPoint.color.green, selectedPoint.color.blue));
        selectedPoint.color.alpha = 0.999;
        selectedPoint.outlineWidth = 3;
    }

}

function hideAllPoints(){
    for(var i =0; i < earthquakes.length; i++){
        earthquakes[i].primitivePoint.show = false;
    }
}

function clonePoint(primitivePoint, clone){
    clone.position = primitivePoint.position.clone();
    clone.color =  primitivePoint.color.clone();
    clone.pixelSize =  primitivePoint.pixelSize;
    clone.id = primitivePoint.id;
}

const zoomFactor = 1.3;
//Double click
handler.setInputAction(function(click) {
    doubleClickHandler(click);

}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

function doubleClickHandler2d(click){
    var pickedObject = viewer.scene.pick(click.position);
    if(pickedObject !== undefined) {
        var cameraHeight = viewer.scene.camera.positionCartographic.height;
        var e = pickedObject.id;
        var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pickedObject.primitive.position);
        var pointHeight = cartographicPosition.height
        cameraHeight -= (cameraHeight/zoomFactor);
        if(cameraHeight < pointHeight + 100){
            cameraHeight = pointHeight + 100;
        }
        moveCameraTo(e, cameraHeight);
    }
}

function moveCameraTo(e, height){
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
          e.origin.longitude,
          e.origin.latitude,
          height),
      orientation: {
          heading: 0.0,
          pitch: -Cesium.Math.PI_OVER_TWO,
          roll: 0.0
        }
    });
}

function doubleClickHandler3d(click){
    var pickedObject = viewer.scene.pick(click.position);

    if(pickedObject !== undefined) {
        var cameraHeight = viewer.scene.camera.positionCartographic.height;
        var e = pickedObject.id;
        var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pickedObject.primitive.position);
        var pointHeight = cartographicPosition.height
        cameraHeight -= (cameraHeight/1.3);
        if(cameraHeight < pointHeight + 100){
            cameraHeight = pointHeight + 100;
        }
        changeCameraRotationCenter(e, pointHeight, cameraHeight);
    }
}

function resetCameraRotationCenter(){
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

}

function changeCameraRotationCenter(e, pointHeight, cameraHeight) {
    var center = Cesium.Cartesian3.fromDegrees(e.origin.longitude, e.origin.latitude, pointHeight);
    var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    var camera = viewer.camera;
    camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
    moveCameraTo(e, cameraHeight);
    camera.lookAtTransform(transform);
}


function updatePointsColor(){
    for( var i = 0; i < earthquakes.length; i++){
        earthquakes[i].primitivePoint.color = getCesiumColor(earthquakes[i]);
    }
    underLinePoint(pickedPoint, pickedEarthquake);
    setCaption();
}

function updatePointsPosition(){
    for( var i = 0; i < earthquakes.length; i++){
        earthquakes[i].primitivePoint.position = getCartesianPosition(earthquakes[i]);
    }
    viewer.camera.setView({
                              orientation: {
                                  heading: 0.0,
                                  pitch: -Cesium.Math.PI_OVER_TWO,
                                  roll: 0.0
                              }});
    underLinePoint(pickedPoint, pickedEarthquake);
    resetCameraRotationCenter();

}

function removeSelectedPoint(){
    if(selectedPoint !== undefined){
        resetLastPoint();
        points.remove(selectedPoint);
    }
}


function addSelectedPoint(){
    return points.add({
      show : false,
      scaleByDistance : getScaleByDistance()
  });
}

function changePositionMode(mode){
    switch (mode){
        case "3dMode":
            getCartesianPosition = get3dPosition;
            break;
        case "2dMode":
            getCartesianPosition = get2dPosition;

    }
}

function changeOnClickHandler(mode){
    if(!play) {
        switch (mode) {
            case "3dMode":
                doubleClickHandler = doubleClickHandler3d;
                singleClickAction = singleClickUnderlineEarthquake;
                break;
            case "2dMode":
                doubleClickHandler = doubleClickHandler2d;
                singleClickAction = singleClickUnderlineEarthquake;
                break;
            case "playerMode":
                doubleClickHandler = function () {};
                singleClickAction = closeBarMenu;
        }
    }
}


