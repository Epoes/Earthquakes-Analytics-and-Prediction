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
var points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
var start_time;
var end_time;
var minMag;
var maxMag;

// var redCircle = viewer.entities.add({
//     position: Cesium.Cartesian3.fromDegrees(8.651733, 38.876451),
//     name : 'Red circle',
//     ellipse : {
//         semiMinorAxis : 3000.0,
//         semiMajorAxis : 3000.0,
//         material : Cesium.Color.RED.withAlpha(0.5)
//     }
// });
//
$(document).ready(function () {
    setUpDateFilter();
    setUpMagnitudeFilter();
    setUpMaxMinDate(new Date(), new Date());
    setUpMagnitude(0, 10);
    doRequest();
});

function setUpDateFilter(){
    var slider = $( "#slider-range-date" )
    slider.slider({
        range: true,
        min: new Date('1980.01.01').getTime() / 1000,
        max: new Date().getTime() / 1000,
        step: 86400,
        values: [  new Date().getTime() / 1000, new Date().getTime() / 1000 ],
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
})

function doRequest(){
    points.removeAll();
    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/query?count=1000&start_time="+ start_time + "&end_time=" + end_time + "&max_magnitude=" + maxMag + "&min_magnitude=" + minMag,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            drawEarthquakes(data);
            // console.log(data);
        }
    });
}
function setUpMagnitudeFilter(){
    var slider = $( "#slider-range-magnitude" )
    slider.slider({
        range: true,
        min: 0,
        max: 10,
        step: 0.5,
        values: [0, 10],
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
function drawEarthquakes(earthquakes) {
    // var instances = [];
    for(var i = 0; i < earthquakes.length; ++i){
        var latitude = earthquakes[i].origin.latitude;
        var longitude = earthquakes[i].origin.longitude;
        var magnitude = earthquakes[i].magnitude.magnitude;
        var id = earthquakes[i].id;
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
        points.add({
            position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
            color : Cesium.Color.fromCssColorString(adjustColor(magnitude)).withAlpha(0.3),
            pixelSize: magnitude*10,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2, 1.5e7, 0.0),
            id: id
        });
    }

}

$('.hamburger').click(function () {
    openNav();
    // $('.hamburger').hide();
});

$('.closebtn').click(function () {
    closeNav();
    // $('.hamburger').show();
})
/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

