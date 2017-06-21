var italyView = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);
Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = italyView;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

//TODO
$("#charts-menu-body").append("<div id='chart_div_magnitude'></div>");
$("#charts-menu-date").append("<div id='chart_div_date'></div>");

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});


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
    creditContainer : "cesium-credits",

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
const scene = viewer.scene;
scene.debugShowFramesPerSecond = true;
scene.fxaa = true;

//possible optimisation. maximumScreenSpaceError > best performance
scene.globe.maximumScreenSpaceError = 2;
scene.globe.tileCacheSize = 100;


const primitiveCollection = new Cesium.PointPrimitiveCollection();
primitiveCollection.blendOption = 1;
var points = scene.primitives.add(primitiveCollection);

function flyTo(latitude, longitude, high) {
    console.log(high)
    const camera = scene.camera;
    camera.flyTo({
                     destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, high),
                     duration: 2,
                 });
}

$(document).ready(function () {
    getLatestEarthquake(1500);
    setUpFooter();
    setUpMenu();
});