

var italyView = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);

Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = italyView;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;


var earthquakes = undefined;


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
            if(data.length != 0) {

                earthquakes = data;
                setUpDepth(earthquakes);
                setUpDateRange(earthquakes);
                sortByMagnitude(earthquakes);

                //pick control
                closeInfoBox();
                removeSelectedPoint();
                resetCameraRotationCenter();
                setCaption();
                drawEarthquakes(earthquakes);
                if(timeLineMode) {
                    clearTimeLaps();
                }
                setUpTimeLineView();
            }


            if(callback !== undefined){
                callback();
            }
        }
    });
}
























