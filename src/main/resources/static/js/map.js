
//Italy as initial view
var italyView = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);



Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = italyView;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

//Initialize the viewer widget with several custom options and mixins.
var viewer = new Cesium.Viewer('cesiumContainer', {
    //Start in Columbus Viewer
    sceneMode : Cesium.SceneMode.SCENE3D,
    //Use standard Cesium terrain
    terrainProvider : new Cesium.CesiumTerrainProvider({
        url : 'https://assets.agi.com/stk-terrain/world'
    }),

    selectorIndicator : false,
    //Hide the base layer picker
    // baseLayerPicker : false,
    //Use OpenStreetMaps
    imageryProvider : Cesium.createOpenStreetMapImageryProvider({
        url : 'https://a.tile.openstreetmap.org/'
    }),

    // Show Columbus View map with Web Mercator projection
    mapProjection : new Cesium.WebMercatorProjection(),

    animation: false,

    timeline: false,

    navigationHelpButton: false,

    navigationInstructionInitiallyVisible: false,

    creditContainer: 'credit'

});

//0.8421052632

var scene = viewer.scene;
//show fps
scene.debugShowFramesPerSecond = true;

var points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());


$(document).ready(function () {
    setUpDateFilter();
    setUpMagnitudeFilter();
    setUpMaxMinDate(startDate, new Date());
    setUpMagnitude(2, 10);
    doRequest();
});




var earthquakes;

function doRequest(){
    // var start = new Date().getTime();
    var count = 10000000;
    //points.removeAll();
    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/query?count=" + count + "&start_time="+ start_time + "&end_time=" + end_time + "&max_magnitude=" + maxMag + "&min_magnitude=" + minMag,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            earthquakes = data;
            drawEarthquakes(data);
            // var end = new Date().getTime();
            // console.log("execution time: " + (end-start));
        }
    });
}

function anonymous(it) {
    var out='';
    if(it) {
        var value,index=-1,l1=it.length-1;
        while(index<l1){
            value=it[index+=1];
            out+='<li class="earthquake-item">'+(value.regionName)+'</li>';
        }
    }
    // console.log(out);
    return out;
}

var maxMagnitude = 0;
var minMagnitude = 10;

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



function drawEarthquakes(earthquakes) {

    // if(earthquakes.length > bigNumber){
    //     viewer.resolutionScale = 0.8;
    // }
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
        resetPoint(earthquakes[i], points.get(i));
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
        points.add(initPoint(earthquakeList[idx]));
    }

}

function initPoint(earthquake){
    var latitude = earthquake.origin.latitude;
    var longitude = earthquake.origin.longitude;
    var magnitude = earthquake.magnitude.magnitude;
    var id = earthquake.id;
    return {
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),

        color: new Cesium.Color(interpolateColorMagnitude(0,
                                                          magnitude), interpolateColorMagnitude(
            1, magnitude), interpolateColorMagnitude(2, magnitude), 1),
        pixelSize: (5 + (35 - 5) * (magnitude / 10)),
        scaleByDistance: new Cesium.NearFarScalar(0, 10, 1.5e4, 1),
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e8),
        translucencyByDistance: magnitudeNearFarScalar(magnitude, earthquakes.length),
        id: id
    };
}

function resetPoint(earthquake, point){
    var latitude = earthquake.origin.latitude;
    var longitude = earthquake.origin.longitude;
    var magnitude = earthquake.magnitude.magnitude;
    var id = earthquake.id;
    point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
    point.color =
        new Cesium.Color(interpolateColorMagnitude(0, magnitude), interpolateColorMagnitude(
            1, magnitude), interpolateColorMagnitude(2, magnitude), 1);
    point.pixelSize = (5 + (35 - 5) * (magnitude / 10));
    point.translucencyByDistance = magnitudeNearFarScalar(magnitude, earthquakes.length);
    point.id = id;
    point.show = true;
}


var bigNumber = 10000;
var lowNumber = 2000;

//usa il max magnitude per pddc

function magnitudeNearFarScalar(magnitude, count) {
    if(count > bigNumber){
        return getLowPerformanceNearFarScalar(magnitude);
    }

    return getNormalPerformanceNearFarScalar(magnitude);

}

//TODO:pensa pensa

// function getHighPerformanceNearFarScalar(magnitude){
//     if(magnitude <= 2) {
//         return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 1e6 * (magnitude), 0.0);
//     }
//     else if(magnitude <= 4){
//         return new Cesium.NearFarScalar(1.5e5 * (magnitude), 0.9, 1.5e6 * (magnitude), 0.0);
//     }else{
//         return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
//     }
// }

function getNormalPerformanceNearFarScalar(magnitude){
    if(magnitude <= 2) {
        return new Cesium.NearFarScalar(1.5e2 * (magnitude), 0.9, 1e6 * (magnitude), 0.0);
    }
    else if(magnitude <= 4){
        return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 1.5e6 * (magnitude), 0.0);
    }else{
        return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
    }
}
// function getLowPerformanceNearFarScalar(magnitude){
//     if(magnitude <= 2){
//         return new Cesium.NearFarScalar(1.5e2 * (magnitude), 0.9, 1e4 * (magnitude), 0.0);
//
//     }else if(magnitude <= 3){
//         return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 3e5 * (magnitude), 0.0);
//     }else if(magnitude <= 4) {
//         return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 3e6 * (magnitude), 0.0);
//     }else{
//         return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
//     }
// }

function getLowPerformanceNearFarScalar(magnitude){
    if(magnitude <= 2){
        return new Cesium.NearFarScalar(interpolate(1.5e3, 5e3, (magnitude/2)), 0.9, interpolate(1e4, 5e4, (magnitude/2)), 0.0);
    }else if(magnitude <= 3){
        return new Cesium.NearFarScalar(interpolate(1.5e4, 4.5e4, (magnitude - 2)), 0.9, interpolate(3e5, 9e5, (magnitude - 2)), 0.0);
    }else if(magnitude <= 4) {
        return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 3e6 * (magnitude), 0.0);
    }else{
        return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
    }
}

var green = [0.0,1.0,0.0];
var yellow = [1.0,1.0,0.0];
var red = [1.0,0.0,0.0];
var purple = [0.0,0.294,0.51];

function interpolateColorMagnitude(inx, magnitude){
    if(magnitude <= 3){
        return interpolate(green[inx], yellow[inx], magnitude/3);
    } else if(magnitude <= 6){
        return interpolate(yellow[inx], red[inx], (magnitude-3)/3);
    }else {
        return interpolate(red[inx], purple[inx], (magnitude-6)/4);
    }

}


//
// viewer.canvas.addEventListener("click", function(e){
//         var mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);
//         var ellipsoid = viewer.scene.globe.ellipsoid;
//         var cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
//         var cartographic = ellipsoid.cartesianToCartographic(cartesian);
//         var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
//         var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
//
//         var targetEarthquake;
//         var squareMinDistance = 1000000;
//         for (var i = 0; i < earthquakes.length; i++) {
//             var e = earthquakes[i];
//             var distance = Math.pow(e.origin.longitude - longitude, 2) + Math.pow(e.origin.latitude - latitude, 2);
//             if (distance < squareMinDistance) {
//                 squareMinDistance = distance;
//                 targetEarthquake = e;
//
//             }
//         }
//         drawPin(targetEarthquake.origin.latitude, targetEarthquake.origin.longitude);
//
//         $("#earthquake-info").empty();
//         openNav("Part");
//         displayInfo(targetEarthquake);
// });

handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (click) {
    var pickedObject = viewer.scene.pick(click.position);

    //if not undefined
    if(pickedObject !== undefined) {
        var id = pickedObject.id;
        for (var i = 0; i < earthquakes.length; i++) {
            var e = earthquakes[i];

            if (e.id == id) {
                drawPin(e.origin.latitude, e.origin.longitude);
                $("#earthquake-info").empty();
                openNav("Part");
                displayInfo(e);
            }
        }

    }else{
        cancelPin();
    }



}, Cesium.ScreenSpaceEventType.LEFT_CLICK);




function drawPin(latitude, longitude) {
    entityPin.position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
    entityPin.billboard.show = true;
}

function cancelPin() {
    entityPin.billboard.show = false;
}

var pinBuilder = new Cesium.PinBuilder();
var entityPin = viewer.entities.add({
            name: 'EarthQuakePin',
            billboard: {
                image: pinBuilder.fromText('!', Cesium.Color.BLACK, 48).toDataURL(),
                //image: pinBuilder.fromUrl("https://pilotmoon.com/popclip/extensions/icon/pin.png", Cesium.Color.BLACK, 48).toDataURL(),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scaleByDistance : new Cesium.NearFarScalar(0, 5, 1.5e4, 1),
                show : false
            }
    });

//
