//
// var map = L.map(document.getElementById('map')).setView([43.097003, 12.390278], 5);
// var italyLayer = L.geoJson(italyNeighbors).addTo(map);
// map.fitBounds(italyLayer.getBounds());
//
// var markers = new L.FeatureGroup();
//
// $("#query-button").click(function () {
//     markers.clearLayers();
//     var magnitude = document.getElementById("magnitude-field").value;
//     var count = document.getElementById("count-field").value;
//     $.ajax({
//         url: "http://localhost:8080/api/earthquakes/last-update/" + validateCount(count) + "/" + validateMagnitude(magnitude),
//         type: "GET",
//         success: function (data, textStatus, jqXHR) {
//          // drawEarthquakes(data);
//             console.log(data);
//         }
//     });
// });
//
// function validateMagnitude(magnitude){
//     return magnitude ? magnitude : 2;
// }
//
// function validateCount(count){
//     return count ? count : 100;
// }
//
// function drawEarthquakes(earthquakes) {
//     for(var i = 0; i < earthquakes.length; ++i){
//         var latitude = earthquakes[i].origin.latitude;
//         var longitude = earthquakes[i].origin.longitude;
//         var magnitude = earthquakes[i].magnitude.magnitude;
//         var circle = (L.circle([latitude, longitude], {radius: adjustRadius(magnitude), color: adjustColor(magnitude), stroke: false}));
//         var center = (L.circle([latitude, longitude], {radius: adjustRadius(magnitude)/1000, color: adjustColor(magnitude)}));
//         var popup = L.popup()
//             .setLatLng([latitude, longitude])
//             .setContent("<b>Magnitude: </b>" + magnitude + "<br> <b>Zone: </b>" + earthquakes[i].regionName + "<br><b>Date: </b>" + dateFormatter(earthquakes[i].origin.time))
//             .openOn(map);
//         circle.bindPopup(popup).openPopup(center);
//         markers.addLayer(circle);
//         markers.addLayer(center);
//     }
//     map.addLayer(markers);
// }
//

var extent = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);


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

    geocoder: false,

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
    setUpMaxMinDate(new Date('2017.01.01'), new Date());
    setUpMagnitude(2, 10);
    doRequest();
});

function setUpDateFilter(){
    var slider = $( "#slider-range-date" )
    slider.slider({
        range: true,
        min: new Date('1980.01.01').getTime() / 1000,
        max: new Date().getTime() / 1000,
        step: 86400,
        values: [  new Date('2017.01.01').getTime() / 1000, new Date().getTime() / 1000 ],
        change: function (event, ui) {
            setUpMaxMinDate(new Date(ui.values[0]*1000), new Date(ui.values[1]*1000));
        },
        slide: function( event, ui ) {
            $( "#amount-date" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
        }
    });
    $( "#amount-date" ).val( (new Date(slider.slider( "values", 0 )*1000).toDateString()) +
        " - " + (new Date(slider.slider( "values", 1 )*1000)).toDateString());
}




function setUpMaxMinDate(minTime, maxTime){
    minTime.setHours(00, 00, 00);
    maxTime.setHours(23, 59, 59);
    start_time = minTime.customFormat("#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#");
    end_time = maxTime.customFormat("#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#");

}

$('#query-button').click(function () {
    doRequest();
    //$("#query-container").slideUp();
    //$("#searchBtn").css("visibility", "visible");
});

$("#searchBtn").click(function () {
    $("#query-container").slideDown();
    $("#searchBtn").css("visibility", "hidden");
})


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
            console.log("execution time: " + (end-start));
        }
    });
}

function listEarthquakes(earthquakes){
    $('#list-earthquakes').append("<ul id='list'></ul>");
    for(var i = 0; i < earthquakes.length; ++i){
        var date = new Date(earthquakes[i].origin.time);
        $("#list").append("<li class='earthquake-item'><a>"+ earthquakes[i].regionName + "<br> " + date.customFormat("#DD#-#MMM#-#YYYY#") +"</a></li>");
    }
    // $("#list").append(anonymous(earthquakes));
    $("#list").slice(20).hide();
}

//var mincount = 20;
//var maxcount = 40;
//
//$(window).scroll(function() {
//     if($(window).scrollTop() + $(window).height() >= $(document).height() - 400) {
//         $("#list li").slice(mincount,maxcount).fadeIn(1200);
//
//         mincount = mincount+20;
//         maxcount = maxcount+20;
//
//     }
// });

function anonymous(it) {
    var out='';
    if(it) {
        var value,index=-1,l1=it.length-1;
        while(index<l1){
            value=it[index+=1];
            out+='<li class="earthquake-item">'+(value.regionName)+'</li>';
        }
    }
    console.log(out);
    return out;
}

function setUpMagnitudeFilter(){
    var slider = $( "#slider-range-magnitude" )
    slider.slider({
        range: true,
        min: 0,
        max: 10,
        step: 0.5,
        values: [2, 10],
        change: function (event, ui) {
            setUpMagnitude(ui.values[0], ui.values[1]);
        },
        slide: function( event, ui ) {
            $( "#amount-magnitude" ).val("Magnitude between: " + ui.values[0] + " and " + ui.values[1]);
        }
    });
    $( "#amount-magnitude" ).val( "Magnitude between: " + slider.slider( "values", 0 ) + " and " + slider.slider( "values", 1 ));
}




function setUpMagnitude(minMagn, maxMagn) {
    minMag = minMagn;
    maxMag = maxMagn;
}

// var instance = new Cesium.GeometryInstance({
//     geometry : new Cesium.CircleGeometry({
//         center : Cesium.Cartesian3.fromDegrees(longitude, latitude),
//         radius : 90000.0,
//         granularity : 2 * Cesium.Math.RADIANS_PER_DEGREE,
//         vertexFormat: Cesium.VertexFormat.POSITION_AND_COLOR
//     }),
//     attributes : {
//         color : new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.4)
//     }
// });
// instances.push(instance);

function drawEarthquakes(earthquakes) {
    var count =  earthquakes.length;
    var space = points.length;
    var difference = earthquakes.length - points.length;
    console.log("I have " + space + " points to use");
    console.log("I have " + count + " earthquake to display");
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



    console.log("now I have: " +  points.length + "points" );
    //$("#list-earthquakes").empty();
    //listEarthquakes(earthquakes);
}



viewer.canvas.addEventListener("click", function(e){
        var mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);

        var targetEarthquake;
        var squareMinDistance = 1000000;
        for (var i = 0; i < earthquakes.length; i++) {
            var e = earthquakes[i];
            var distance = Math.pow(e.origin.longitude - longitude, 2) + Math.pow(e.origin.latitude - latitude, 2);
            if (distance < squareMinDistance) {
                squareMinDistance = distance;
                targetEarthquake = e;

            }
        }
        drawPin(targetEarthquake.origin.latitude, targetEarthquake.origin.longitude);

        $("#earthquake-info").empty();
        openNav("Part");
        displayInfo(targetEarthquake);
});


function displayInfo(earthquake) {
    var date = new Date(earthquake.origin.time);
    $('#earthquake-info').append("<ul id='list-info'></ul>");
    $("#list-info").append("<li class='info-item'><a>Zone: " + earthquake.regionName +"</a></li>");
    $("#list-info").append("<li class='info-item'><a>Magnitude: " + earthquake.magnitude.magnitude + " " + earthquake.magnitude.type + "</a></li>");
    $("#list-info").append("<li class='info-item'><a>Depth: " + earthquake.origin.depth +" m</a></li>");
    $("#list-info").append("<li class='info-item'><a>Date: " + date.customFormat("#DD#-#MMM#-#YYYY#") +"</a></li>");

}

var pinBuilder = new Cesium.PinBuilder();


function drawPin(latitude, longitude) {
    entityPin.position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
    entityPin.billboard.show = true;
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
        return interpolateColor(green[inx], yellow[inx], magnitude/3);
    } else if(magnitude <= 6){
        return interpolateColor(yellow[inx], red[inx], (magnitude-3)/3);
    }else {
        return interpolateColor(red[inx], purple[inx], (magnitude-6)/3);
    }

}

function interpolateColor(a, b, t){
    return (a + (b-a)*t);
}

$('.hamburger').click(function () {
    openNav("Left");
});

$('#closebtnLeft').click(function () {
    closeNav("Left");
});

$('#closebtnPart').click(function () {
    closeNav("Part");
});
/* Set the width of the side navigation to 250px */
function openNav(side) {
    document.getElementById("mySidenav" + side).style.width = "280px";
}

/* Set the width of the side navigation to 0 */
function closeNav(side) {
    document.getElementById("mySidenav" + side).style.width = "0";
}

