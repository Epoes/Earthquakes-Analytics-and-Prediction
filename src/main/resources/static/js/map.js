
var italyView = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);

Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = italyView;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;


var earthquakes = undefined;
var selectedPoint = undefined;


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
    projectionPicker : false,
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


var totalTime = 30;
function timeLineShowEvent(){
    showTimeLine();
    // hidePoints();
    sortByDate(earthquakes);
    // var minTime = minLongTime;
    // var maxTime = maxLongTime;
    // var timeInterval = maxTime - minTime;


    // var step = (timeInterval/totalTime);
    // var index = 0;
    // var timer = setInterval(function(){
    //     index = showPoints(minTime, step, index, earthquakes);
    //     minTime += step;
    //
    //     if(minTime >= maxTime){
    //         clearInterval(timer);
    //         console.log("clear!");
    //     }
    //
    // }, 1000);

    // sortByMagnitude(earthquakes);
    // drawEarthquakes(earthquakes);
}


function showPoints(currentTime, step, index, earthquakes){

    while(index < earthquakes.length && earthquakes[index].origin.time <= currentTime + step){
            earthquakes[index].primitivePoint.show = true;
            index++;

        }
    return index;
}


function hidePoints(){
    for(var i = 0; i < earthquakes.length; i++){
        points.get(i).show = false;
    }
}



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
            // console.log("query size for " + data.length + " objects: " + (sizeof(data[0]) * data.length));
            setUpDepth(earthquakes);
            setUpDateRange(earthquakes);
            sortByMagnitude(earthquakes);
            closeInfoBox();
            removeSelectedPoint();
            resetCameraRotationCenter();
            drawEarthquakes(data);

            if(callback !== undefined){
                callback();
            }
            // timeLineShowEvent();
        }
    });
}

function removeSelectedPoint(){
    if(selectedPoint !== undefined){
        resetLastPoint();
        points.remove(selectedPoint);
    }
}

var maxLongTime;
var minLongTime;
var interval;
var step;
function setUpDateRange(earthquakes){
    if(earthquakes.length > 0 ) {
        maxLongTime = earthquakes[0].origin.time;
        minLongTime = earthquakes[earthquakes.length - 1].origin.time;
        interval = maxLongTime - minLongTime;
        step = interval / 3;
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

function drawEarthquakes(earthquakes) {
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

function addSelectedPoint(){
    return points.add({
        show : false,
        scaleByDistance: getNearForScalar()
               });
}

function updatePointsColor(){
    for( var i = 0; i < earthquakes.length; i++){

        //TODO: cancel. test base
        if(points.get(i).id != earthquakes[i].id){
            console.log(points.get(i).id);
            console.log(earthquakes[i].id);
        }
        points.get(i).color = getCesiumColor(earthquakes[i]);
    }

    underLinePoint(pickedPoint, pickedEarthquake);

}

function updatePointsPosition(){
    for( var i = 0; i < earthquakes.length; i++){

        //TODO: cancel. test base
        if(points.get(i).id != earthquakes[i].id){
            console.log(points.get(i).id);
            console.log(earthquakes[i].id);
        }
        points.get(i).position = getCartesianPosition(earthquakes[i]);
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

function cancelPointsFrom(idx, pointsList) {
    for (idx; idx < pointsList.length; ++idx) {
        points.get(idx).show = false;
    }
}

function addPointFrom(idx, earthquakeList){
    for (idx; idx < earthquakeList.length; ++idx) {
        points.add(initPoint(earthquakeList[idx], idx));
        earthquakeList[idx].primitivePoint = points.get(idx);
    }

}

function initPoint(earthquake, index){
    var id = earthquake.id;
    return {
        position: getCartesianPosition(earthquake),
        id : id,
        color: getCesiumColor(earthquake),
        pixelSize: getPixelSize(earthquake),
        scaleByDistance: getNearForScalar(),
        translucencyByDistance: magnitudeNearFarScalar(earthquake, index, earthquakes.length)
    };
}

function get3dPosition(e){
    return Cesium.Cartesian3.fromDegrees(e.origin.longitude, e.origin.latitude, (maxDepth - e.origin.depth));
}

function get2dPosition(e){
    return Cesium.Cartesian3.fromDegrees(e.origin.longitude, e.origin.latitude, e.magnitude.magnitude);
}

function resetPoint(earthquake, point, index){
    earthquake.primitivePoint = point;
    var id = earthquake.id;

    point.position = getCartesianPosition(earthquake);
    point.id = id;
    point.color =  getCesiumColor(earthquake);
    point.pixelSize =  getPixelSize(earthquake);
    point.translucencyByDistance =  magnitudeNearFarScalar(earthquake, index, earthquakes.length);
    point.show = true;
}


const scalarFactor = new Cesium.NearFarScalar(0, 10, 1.5e4, 1);
function getNearForScalar() {
    return scalarFactor;
}


function getPixelSize(e) {
    const minimum = 5;
    const maximum = 35;
    const maxMagnitude = 10;
    var magnitude = e.magnitude.magnitude;
    return (minimum + (maximum - minimum) * (magnitude / maxMagnitude));
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



var green = [0.0,1.0,0.0];
var yellow = [1.0,1.0,0.0];
var red = [1.0,0.0,0.0];
var orange =[1.0, 0.647, 0];
var purple = [0.0,0.0,1.0];

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
        return interpolate(green[inx], yellow[inx], magnitude/3);
    } else if(magnitude <= 6){
        return interpolate(yellow[inx], red[inx], (magnitude-3)/3);
    }else {
        return interpolate(red[inx], purple[inx], (magnitude-6)/4);
    }

}

var pickedPoint = undefined;
var pickedEarthquake = undefined;
var pickedIndex = 0;
var pickedNearForScalar;
handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction(function (click) {

    resetCameraRotationCenter();
    var pickedObject = viewer.scene.pick(click.position);

    //click on nothing
    if(pickedObject === undefined){
        resetLastPoint();
        return;
    }
    //click on the same object
    if(pickedPoint !== undefined && pickedObject.primitive.id == pickedPoint.primitive.id){
        showInfoBox(pickedEarthquake);
        return;
    }
    //click on other object
    resetLastPoint();
    if(pickedObject !== undefined) {
        switchUnderlinePoint(pickedObject);
    }



}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

function switchUnderlinePoint(pickedObject){
    var id = pickedObject.id;
    for (var i = 0; i < earthquakes.length; i++) {
        var e = earthquakes[i];
        if (e.id == id) {
            pickedEarthquake = e;
            pickedPoint = pickedObject;
            pickedIndex = i;
            pickedNearForScalar = pickedPoint.primitive.translucencyByDistance.clone();
            underLinePoint(pickedObject, e);
            setTimeout(showInfoBox(e), 0);
            return;
        }
    }
}
function resetLastPoint(){
    if(pickedPoint !== undefined) {
        pickedPoint.primitive.show = true;
        selectedPoint.show = false;
        pickedPoint = undefined;
        pickedEarthquake = undefined;
        pickedIndex = 0;
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

function clonePoint(primitivePoint, clone){
    clone.position = primitivePoint.position.clone();
    clone.color =  primitivePoint.color.clone();
    clone.pixelSize =  primitivePoint.pixelSize;
    clone.id = primitivePoint.id;
}

const zoomFactor = 1.3;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function(click) {
    doubleClickHandler(click);

}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

function doubleClickHandler2d(click){
    var pickedObject = viewer.scene.pick(click.position);
    var cameraHeight = viewer.scene.camera.positionCartographic.height;
    if(pickedObject !== undefined) {
        var id = pickedObject.id;
        for (var i = 0; i < earthquakes.length; i++) {
            var e = earthquakes[i];
            if (e.id == id) {
                var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pickedObject.primitive.position);

                var pointHeight = cartographicPosition.height
                cameraHeight -= (cameraHeight/zoomFactor);
                if(cameraHeight < pointHeight + 100){
                    cameraHeight = pointHeight + 100;
                }
                moveCameraTo(e, cameraHeight);
                return;
            }
        }
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
                      }});
}

function doubleClickHandler3d(click){
    var pickedObject = viewer.scene.pick(click.position);
    var cameraHeight = viewer.scene.camera.positionCartographic.height;
    if(pickedObject !== undefined) {
        var id = pickedObject.id;
        for (var i = 0; i < earthquakes.length; i++) {
            var e = earthquakes[i];
            if (e.id == id) {
                var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pickedObject.primitive.position);
                var pointHeight = cartographicPosition.height
                cameraHeight -= (cameraHeight/1.3);
                if(cameraHeight < pointHeight + 100){
                    cameraHeight = pointHeight + 100;
                }
                changeCameraRotationCenter(e, pointHeight, cameraHeight);
                return;
            }
        }
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


//settings

var selectedColorInterpolation = interpolateColorByMagnitude;
var getCartesianPosition = get2dPosition;
var doubleClickHandler = doubleClickHandler2d;



