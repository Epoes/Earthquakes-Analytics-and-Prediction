
var extent = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);

Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

//Initialize the viewer widget with several custom options and mixins.
var viewer = new Cesium.Viewer('cesiumContainer', {
    //Start in Columbus Viewer
    sceneMode : Cesium.SceneMode.SCENE2D,
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
    // imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
    //     url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    // }),
    // Show Columbus View map with Web Mercator projection
    mapProjection : new Cesium.WebMercatorProjection(),

    animation: false,

    // geocoder: false,

    timeline: false,

    navigationHelpButton: false,

    navigationInstructionInitiallyVisible: false,

    creditContainer: 'credit'

});

var scene = viewer.scene;
//show fps
scene.debugShowFramesPerSecond = true;
var points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
var start_time;
var end_time;
var minMag;
var maxMag;


$(document).ready(function () {
    setUpDateFilter();
    setUpMagnitudeFilter();
    setUpMaxMinDate(new Date('2017-01-01'), new Date());
    setUpMagnitude(2, 10);
    doRequest();
});




var earthquakes;

function doRequest(){
    var start = new Date().getTime();
    var count = 10000000;
    //points.removeAll();
    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/query?count=" + count + "&start_time="+ start_time + "&end_time=" + end_time + "&max_magnitude=" + maxMag + "&min_magnitude=" + minMag,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            earthquakes = data;
            drawEarthquakes(data);
            var end = new Date().getTime();
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


function drawEarthquakes(earthquakes) {
    var count =  earthquakes.length;
    var space = points.length;
    var difference = earthquakes.length - points.length;
    // console.log("I have " + space + " points to use");
    // console.log("I have " + count + " earthquake to display");
    if (difference < 0) {
        var i;
        for (i = 0; i < count; ++i) {

            var point = points.get(i);
            var latitude = earthquakes[i].origin.latitude;
            var longitude = earthquakes[i].origin.longitude;
            var magnitude = earthquakes[i].magnitude.magnitude;
            var id = earthquakes[i].id;


            point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
            point.color =
                new Cesium.Color(interpolateColorMagnitude(0, magnitude), interpolateColorMagnitude(
                    1, magnitude), interpolateColorMagnitude(2, magnitude), 1);
            point.pixelSize = (5 + (35 - 5) * (magnitude / 10));
            point.translucencyByDistance = magnitudeNearFarScalar(magnitude, count);
            point.id = id;
            point.show = true;
        }

        for(i; i < space; ++i){
            var point = points.get(i);
            point.show = false;
        }
    }else {
        var i;
        for (i = 0; i < space; ++i) {

            var point = points.get(i);
            var latitude = earthquakes[i].origin.latitude;
            var longitude = earthquakes[i].origin.longitude;
            var magnitude = earthquakes[i].magnitude.magnitude;
            var id = earthquakes[i].id;


            point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
            point.color =
                new Cesium.Color(interpolateColorMagnitude(0, magnitude), interpolateColorMagnitude(
                    1, magnitude), interpolateColorMagnitude(2, magnitude), 1);
            point.pixelSize = (5 + (35 - 5) * (magnitude / 10));
            point.translucencyByDistance = magnitudeNearFarScalar(magnitude, count);
            point.id = id;
            point.show = true;
        }

        for (i; i < count; ++i) {
            var latitude = earthquakes[i].origin.latitude;
            var longitude = earthquakes[i].origin.longitude;
            var magnitude = earthquakes[i].magnitude.magnitude;
            var id = earthquakes[i].id;
            points.add({
                           position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                           color: new Cesium.Color(interpolateColorMagnitude(0,
                                                                             magnitude), interpolateColorMagnitude(
                               1, magnitude), interpolateColorMagnitude(2, magnitude), 1),
                           pixelSize: (5 + (35 - 5) * (magnitude / 10)),
                           scaleByDistance: new Cesium.NearFarScalar(0, 10, 1.5e4, 1),
                           distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e8),
                           translucencyByDistance: magnitudeNearFarScalar(magnitude, count),
                           id: id
                       });
        }
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
                console.log(e);

            }
        }

    }else{
        cancelPin();
    }



}, Cesium.ScreenSpaceEventType.LEFT_CLICK);


function displayInfo(earthquake) {
    var date = new Date(earthquake.origin.time);
    $('#earthquake-info').append("<ul id='list-info'></ul>");
    $("#list-info").append("<li class='info-item'><a>Zone: " + earthquake.regionName +"</a></li>");
    $("#list-info").append("<li class='info-item'><a>Magnitude: " + earthquake.magnitude.magnitude + " " + earthquake.magnitude.type + "</a></li>");
    $("#list-info").append("<li class='info-item'><a>Depth: " + earthquake.origin.depth +" m</a></li>");
    $("#list-info").append("<li class='info-item'><a>Date: " + formatDateForList(date) +"</a></li>");

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
    seconds = addZeroToString(seconds)

    return day + " " + monthToString + " " + year + " at " + hours + "h" +minutes + "m" + seconds + "s";
}



var pinBuilder = new Cesium.PinBuilder();

function drawPin(latitude, longitude) {
    entityPin.position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
    entityPin.billboard.show = true;
}

function cancelPin() {
    entityPin.billboard.show = false;
}


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






var bigNumber = 50000;

function magnitudeNearFarScalar(magnitude, count) {
    if(magnitude <= 2 && count > bigNumber){
        return new Cesium.NearFarScalar(1.5e2 * (magnitude), 0.9, 1e4 * (magnitude), 0.0);

    }else if(magnitude <= 3 && count > bigNumber){
        return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 3e5 * (magnitude), 0.0);
    }else if(magnitude <= 4 && count > bigNumber) {
        return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 3e6 * (magnitude), 0.0);
    }else{

        if(magnitude <= 2) {
            return new Cesium.NearFarScalar(1.5e2 * (magnitude), 0.9, 1e6 * (magnitude), 0.0);
        }
        else if(magnitude <= 4){
            return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 1.5e6 * (magnitude), 0.0);
        }else{
            return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
        }
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
        return interpolate(red[inx], purple[inx], (magnitude-6)/3);
    }

}


