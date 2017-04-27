
var italyView = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);

Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = italyView;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;


var earthquakes;
//Initialize the viewer widget with several custom options.
var viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    fullscreenButton : true,
    vrButton : false,
    homeButton : true,
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
    creditContainer : null,

    terrainExaggeration : 1,

    shadows : false,
    projectionPicker : false,
});

//remove fixed entity.
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);


//TODO: scene option. play with webGL options
const scene = viewer.scene;
scene.debugShowFramesPerSecond = true;
scene.fxaa = true;

const primitiveCollection = new Cesium.PointPrimitiveCollection();
primitiveCollection.blendOption = 1;
var points = scene.primitives.add(primitiveCollection);





var stdRequest = {
    count : 10000,
    endTime : new Date(),
    startTime : new Date(),
    minMag : 2,
    maxMag : 10,
    minDepth : -1000,
    maxDepth : 20000,
    minPoint : {
        longitude: 35,
        latitude: 5
    },
    maxPoint : {
        longitude: 49,
        latitude: 20
    }
};

stdRequest.startTime.setDate(stdRequest.startTime.getDate() - 100000);

$(document).ready(function () {
    // setUpDateFilter();
    // setUpMagnitudeFilter();
    // setUpMaxMinDate(startDate, new Date());
    // setUpMagnitude(2, 10);

    doRequest(stdRequest);

    // var point = points.add({
    //                position: Cesium.Cartesian3.fromDegrees(15, 38, 0),
    //                color: new Cesium.Color(0,0,1,1),
    //                pixelSize: 100
    //            })
    // var startTime = Date.now();
    // setInterval(function(){
    //     animatePoint(point, startTime)
    // }, 10);

});

// function animatePoint(point, startTime){
//     console.log("ciaone")
//     var maxTime =  1;
//     var currentTime = (Date.now() - startTime)/1000;
//     console.log(currentTime)
//     if(currentTime <= 1) {
//         point.pixelSize = currentTime*100;
//     }
// }

// var sort = util.sortByMagnitude;



function doRequest(request){
    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/query?count=" + request.count + "&start_time="+ formatDateForQuery(request.startTime)
             + "&end_time=" + formatDateForQuery(request.endTime) + "&max_magnitude=" + request.maxMag + "&min_magnitude=" +
             request.minMag + "&min_depth=" + request.minDepth + "&max_depth=" + request.maxDepth,

             // "&min_lat=" + minPoint.latitude +
             // "&min_lng=" + minPoint.longitude + "&max_lat=" + maxPoint.latitude + "&max_lng=" + maxPoint.longitude,

        type: "GET",
        success: function (data, textStatus, jqXHR) {
            earthquakes = data;
            setUpDepth(earthquakes);
            setUpDateRange(earthquakes);
            sortByMagnitude(earthquakes);
            drawEarthquakes(data);
        }
    });
}

var maxLongTime;
var minLongTime;
var interval;
var step;
function setUpDateRange(earthquakes){
    maxLongTime = earthquakes[0].origin.time;
    minLongTime = earthquakes[earthquakes.length - 1].origin.time;
    interval = maxLongTime - minLongTime;
    step = interval/3;
}

var minDepth = 700000;
var maxDepth = -1000;
var depthInterval;
var depthStep;

function setUpDepth(earthquakes){
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
}
//
// function anonymous(it) {
//     var out='';
//     if(it) {
//         var value,index=-1,l1=it.length-1;
//         while(index<l1){
//             value=it[index+=1];
//             out+='<li class="earthquake-item">'+(value.regionName)+'</li>';
//         }
//     }
//     // console.log(out);
//     return out;
// }
//
// var maxMagnitude = 0;
// var minMagnitude = 10;
//
// function findMinMaxMagnitude(earthquakes){
//     lowMagnitude = (maxMag + minMag)*0.3;
//     midMagnitude = (maxMag + minMag)*0.5;
//     for(var i = 0; i < earthquakes.length; ++i){
//         if(earthquakes[i].magnitude.magnitude < minMagnitude){
//             minMagnitude = earthquakes[i].magnitude.magnitude ;
//         }
//         if(earthquakes[i].magnitude.magnitude  > maxMagnitude){
//             maxMagnitude = earthquakes[i].magnitude.magnitude;
//         }
//     }
// }
//
//
//
function drawEarthquakes(earthquakes) {

    // findMinMaxMagnitude(earthquakes);
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
}

function cancelPointsFrom(idx, pointsList) {
    for (idx; idx < pointsList.length; ++idx) {
        var point = points.get(idx);
        point.show = false;
    }
}

function addPointFrom(idx, earthquakeList){
    for (idx; idx < earthquakeList.length; ++idx) {
        points.add(initPoint(earthquakeList[idx], idx));
    }

}

function initPoint(earthquake, index){
    var latitude = earthquake.origin.latitude;
    var longitude = earthquake.origin.longitude;
    var magnitude = earthquake.magnitude.magnitude;
    var id = earthquake.id;
    return {
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, magnitude),
        id : id,
        color: getCesiumColor(earthquake),
        pixelSize: getPixelSize(earthquake),
        scaleByDistance: getNearForScalar(),
        translucencyByDistance: magnitudeNearFarScalar(earthquake,index, earthquakes.length)
    };
}

function resetPoint(earthquake, point, index){
    var latitude = earthquake.origin.latitude;
    var longitude = earthquake.origin.longitude;
    var magnitude = earthquake.magnitude.magnitude;
    var id = earthquake.id;

    point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, magnitude);
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
// var purple = [0.0,0.294,0.51];
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

//default color pick.
var selectedColorInterpolation = interpolateColorByMagnitude;

// var selectedColorInterpolation = interpolateColorByTime;
// var selectedColorInterpolation = interpolateColorByDepth;



var pinBuilder = new Cesium.PinBuilder();
var entityPin = viewer.entities.add({
    name: 'EarthQuakePin',
    billboard: {
        image: pinBuilder.fromText('!', Cesium.Color.BLACK, 48).toDataURL(),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance : new Cesium.NearFarScalar(0, 5, 1.5e4, 1),
        show : false


    }
});

var pickedPoint = undefined;
var pickedEarthquake = undefined;
var pickedIndex = 0;
handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction(function (click) {
    var pickedObject = viewer.scene.pick(click.position);
    resetLastPoint();
    //if define
    if(pickedObject !== undefined) {
        var id = pickedObject.id;
        for (var i = 0; i < earthquakes.length; i++) {
            var e = earthquakes[i];
            if (e.id == id) {
                pickedEarthquake = e;
                pickedPoint = pickedObject;
                pickedIndex = i;
                underLinePoint(pickedObject, e);
                showInfoBox(e);
            }
        }

    }else{

    }



}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

function resetLastPoint(){
    if(pickedPoint !== undefined) {
        var latitude = pickedEarthquake.origin.latitude;
        var longitude = pickedEarthquake.origin.longitude;
        var magnitude = pickedEarthquake.magnitude.magnitude;
        pickedPoint.primitive.translucencyByDistance = magnitudeNearFarScalar(pickedEarthquake, pickedIndex, earthquakes.length);
        pickedPoint.primitive.outlineWidth = 0;
        pickedPoint.primitive.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, magnitude);
        pickedPoint = undefined;
        pickedEarthquake = undefined;
        pickedIndex = 0;
    }
}

function underLinePoint(point, earthquake){
    points.remove(point.primitive);

    var latitude = earthquake.origin.latitude;
    var longitude = earthquake.origin.longitude;
    point.primitive.translucencyByDistance = undefined;
    point.primitive.outlineColor = Cesium.Color.fromCssColorString(computeColorComplement(point.primitive.color.red, point.primitive.color.green, point.primitive.color.blue));
    point.primitive.color.alpha = 0.999;
    //TODO: try using 0.5*pixelSize
    point.primitive.outlineWidth = 3;
    point.primitive.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 10);
    point.primitive = points.add(point.primitive);
}


var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function(click) {
    var pickedObject = viewer.scene.pick(click.position);
    var height = viewer.scene.camera.positionCartographic.height;
    if(height < 100){
        return;
    }
    if(pickedObject !== undefined) {
        var id = pickedObject.id;
        for (var i = 0; i < earthquakes.length; i++) {
            var e = earthquakes[i];
            if (e.id == id) {

                viewer.camera.setView({
                                          destination: Cesium.Cartesian3.fromDegrees(
                                              e.origin.longitude,
                                              e.origin.latitude,
                                              height - (height/1.3)),
                                          orientation: {
                                              heading: 0.0,
                                              pitch: -Cesium.Math.PI_OVER_TWO,
                                              roll: 0.0
                                          }
                                      });
            }
        }
    }else{

    }

}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);



//
// function drawPin(latitude, longitude) {
//     entityPin.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 10);
//     entityPin.eyeOffset = Cesium.Cartesian3(0.0, 0.0, -1.0);
//     entityPin.billboard.show = true;
// }
//
// function cancelPin() {
//     entityPin.billboard.show = false;
// }

// var bigNumber = 50000;
// var lowNumber = 5000;
// if(count > bigNumber){
//     return getLowPerformanceNearFarScalar(magnitude);
// }else if(count > lowNumber){
//     return getNormalPerformanceNearFarScalar(magnitude);
// }
//
// return getBestPerformanceNearFarScalar(magnitude);

// function getBestPerformanceNearFarScalar(magnitude){
//     return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
// }
//
//
//
// function getNormalPerformanceNearFarScalar(magnitude){
//     if(magnitude <= 2) {
//         return new Cesium.NearFarScalar(1.5e2 * (magnitude), 0.9, 1e6 * (magnitude), 0.0);
//     }
//     else if(magnitude <= 4){
//         return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 1.5e6 * (magnitude), 0.0);
//     }else{
//         return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
//     }
// }
//
// function getLowPerformanceNearFarScalar(magnitude){
//     if(magnitude <= 2){
//         return new Cesium.NearFarScalar(interpolate(1.5e3, 5e3, normalizeT(magnitude, 0, 2)), 0.9, interpolate(1e4, 5e4, (magnitude/2)), 0.0);
//     }else if(magnitude <= 3){
//         return new Cesium.NearFarScalar(interpolate(1.5e4, 4.5e4, normalizeT(magnitude, 2, 3)), 0.9, interpolate(3e5, 9e5, (magnitude - 2)), 0.0);
//     }else if(magnitude <= 4) {
//         return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 3e6 * (magnitude), 0.0);
//     }else{
//         return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
//     }
// }





