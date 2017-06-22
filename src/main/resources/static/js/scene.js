var extent = Cesium.Rectangle.fromDegrees(3.0, 33.7, 21.0, 50.5);

Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";
Cesium.MapboxApi.defaultAccessToken = "pk.eyJ1IjoiZXBvZXMiLCJhIjoiY2oyZ2NvM2kwMDAwYTRhbWUxZGl0MHZqdyJ9.eOUixw7uaM7mitSFFcMvsg";
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
Cesium.Camera.DEFAULT_VIEW_FACTOR = -0.12;


//Initialize the viewer widget with several custom options and mixins.
var viewer2= new Cesium.Viewer('cesiumContainer', {
    //Start in Columbus Viewer
    // sceneMode : Cesium.SceneMode.SCENE2D,
    //Use standard Cesium terrain
    terrainProvider : new Cesium.CesiumTerrainProvider({
        url : 'https://assets.agi.com/stk-terrain/world'
    }),

    selectorIndicator : false,
    //Hide the base layer picker
    baseLayerPicker : false,
    //Use OpenStreetMaps
    imageryProvider : new Cesium.MapboxImageryProvider({
        url: 'https://api.mapbox.com/v4/',
        mapId: 'mapbox.streets-basic',
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

    creditContainer: 'credit-container'

});

$(document).ready(function () {
    htmlbodyHeightUpdate()
    $( window ).resize(function() {
        htmlbodyHeightUpdate()
    });
    $( window ).scroll(function() {
        height2 = $('.main').height()
        htmlbodyHeightUpdate()
    });
    viewer2.entities.show = false;
});

var scene = viewer2.scene;


// scene.debugShowFramesPerSecond = true;


handler = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas);

handler.setInputAction(function (click) {

// console.log(scene.pick(click.position));
//     doubleClickHandler(click);
    singleClickHandler(click);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function(click) {
    doubleClickHandler(click);

}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
var earthquakeDate;
const zoomFactor = 1.2;
function singleClickHandler(click){
    var cameraHeight = 2661459.364219676;
    var pickedObject = scene.pick(click.position);
    if(pickedObject !== undefined) {
        var id = pickedObject.id.id;
        for (var i = 0; i < epicentres.length; ++i) {
            var epicentre = epicentres[i];
            if(epicentre.id === id){
                earthquakeDate = new Date(epicentre.origin.time);
                // viewer2.selectedEntity = new Cesium.Entity({
                //     id:  epicentre.id + "      " + epicentre.magnitude.magnitude,
                //     // description: getEarthquakeInfos(stationMagnitudes, epicentre)
                //     description: formatDateForList(earthquakeDate)
                // });

                var pointHeight = pickedObject.id.origin.depth + maxDepth;
                cameraHeight -= (cameraHeight/zoomFactor);
                if(cameraHeight < pointHeight + 100){
                    cameraHeight = pointHeight + 100;
                }

                moveCameraTo(epicentre.origin, cameraHeight);

                getStationMagnitudes(stationMagnitudes, epicentre);
                $("#topcorner").css('visibility', 'visible');
                $("#magn").text(epicentre.magnitude.magnitude);
                $("#type-magn").text(epicentre.magnitude.type);
                $("#date").text(formatDateForList(earthquakeDate));
                $("#depth").text(epicentre.origin.depth /1000);
                $("#animate-stations").click(function () {
                    nextStation = 0;
                    var ep  = getPrimitiveForEpicentre(epicentre.origin, computeNearestRegion(epicentre.origin.latitude));
                    ep.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.BLACK);
                    neighInterval = setInterval(checkNeighbor, 32);
                });

                $("#propagate-epicentre").click(function () {
                    radiateFromEpicentre(epicentre);
                });
                return;
            }
        }
        for (var i = 0; i < stationMagnitudes2.length; ++i) {
            var stationMagnitude = stationMagnitudes2[i];
            if(stationMagnitude.id === id){
                var date = new Date(stationMagnitude.amplitude.time);
                date.setHours(earthquakeDate.getHours());
                viewer2.selectedEntity = new Cesium.Entity({
                    id:  stationMagnitude.station.name + "      " + stationMagnitude.magnitude,
                    description: formatDateForList(date)
                });

            }
        }
        for(var i = 0; i < elevations.length; ++i){
            var elevation = elevations[i];
            if(elevation.id === id){
                viewer2.selectedEntity = new Cesium.Entity({
                    description: elevation.id
                });
                for(var k = 0; k < attributes.length; ++k){
                    attributes[k].color = oldColors[k];
                }
            }
        }
    }
}


function doubleClickHandler(click){
    var cameraHeight = 2661459.364219676;
    var pickedObject = scene.pick(click.position);
    if(pickedObject !== undefined) {
        var id = pickedObject.id.id;
        for (var i = 0; i < elevations.length; i++) {
            var e = elevations[i];
            if (e.id === id) {
                var pointHeight = pickedObject.id.elevation + maxDepth;
                cameraHeight -= (cameraHeight/zoomFactor);
                console.log(cameraHeight + "before");
                if(cameraHeight < pointHeight + 100){
                    console.log("in");
                    cameraHeight = pointHeight + 100;
                }

                moveCameraTo(e, cameraHeight);
                console.log(cameraHeight + "after");
                return;
            }
        }
    }

}

function moveCameraTo(e, height){
    viewer2.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
            e.longitude,
            e.latitude,
            height),
        orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-90),
            roll: viewer2.camera.roll
        }});
}
