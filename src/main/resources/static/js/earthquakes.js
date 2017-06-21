const minimumPixelSize = 5;
const maximumPixelSize = 35;
const maxMagnitude = 10;
const defaultScaleByDistance = new Cesium.NearFarScalar(0, 10, 1.5e4, 1);
const lowNumber = 400;
const mediumNumber = 6600;
const bigNumber = 85000;
const msPerDay = 86400000;
const zoomFactor = 1.3;

const white = [1.0, 1.0, 1.0, 0.2];
const blue = [0.0, 0.502, 1.0, 0.25];
const lightBlue = [0.0, 1.0, 1.0, 0.3];
const green = [0.0,1.0,0.0, 0.35];
const green_yellow = [0.502, 1.0, 0.0, 0.4];
const yellow = [1.0 ,1.0,0.0, 0.45];
const orange =[1.0, 0.502, 0.0, 0.5];
const red = [1.0, 0.0, 0.0, 0.55];
const darkRed = [0.8, 0.0, 0.0, 0.6];
const color = [white, blue, lightBlue,  green, green_yellow,
               yellow, orange, red, darkRed];

let timeSlider;

let earthquakes;
let screenHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//settings
let settings = {
    selectedColorInterpolation : interpolateColorByMagnitude,
    setCaption : setCaptionByMagnitude,
    getCartesianPosition : get2dPosition,
    singleClickHandler : singleClickUnderlineEarthquake,
    doubleClickHandler : doubleClickHandler2d,
    timeLineMode : false,
    intensityMode : false,
    depthMode : false,
    footerIndex : 0
};

let selectedObjects = {
    pickedPoint : undefined,
    pickedEarthquake : undefined,
    selectedPoint : undefined,
    selectedIntensity : undefined
};


let generalEqInfo = {
    minimumMagnitude : 0.0,
    maxMagnitude : 0.0,
    maxLongTime : 0,
    minLongTime : 0,
    timeInterval : 0,
    stepTimeInterval : 0.0,
    minDepth : 0,
    maxDepth : 0,
    depthInterval : 0,
    depthStep : 0,
};

function afterEarthquakesRequest(data, textStatus, jqXHR) {
    if (data.length != 0) {
        if (settings.timeLineMode) {
            clearTimeLaps();
        }else if(settings.intensityMode){
            cancelIntensity();
        }

        earthquakes = data;
        setUpDepth(earthquakes);
        setUpDateRange(earthquakes);
        sortByMagnitude(earthquakes);

        //pick control
        closeInfoBox();
        removeSelectedPoint();
        resetCameraRotationCenter();
        settings.setCaption();
        deleteAllInfoBoxCards();
        drawEarthquakes(earthquakes);
        setUpTimeLineView();
    }
}

/* input: array of earthquakes objects. output: void. drawEarthquakes reset any primitivePointCollection and reDraw the scene*/
/* earthquakes are drawn in order, best visual effects if earthquakes array sorted by magnitude */
function drawEarthquakes(earthquakes) {
    generalEqInfo.minimumMagnitude = earthquakes[0].magnitude.magnitude;
    generalEqInfo.maxMagnitude = earthquakes[earthquakes.length - 1].magnitude.magnitude;
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
    selectedObjects.selectedPoint = addSelectedPoint();

}

function initPoint(earthquake, index){
    return {
        position: settings.getCartesianPosition(earthquake),
        id : earthquake,
        color: getCesiumColor(earthquake),
        pixelSize: getPixelSize(earthquake),
        scaleByDistance: getScaleByDistance(),
        translucencyByDistance: magnitudeNearFarScalar(earthquake, index, earthquakes.length)
    };
}

function resetPoint(earthquake, point, index){
    earthquake.primitivePoint = point;
    point.position = settings.getCartesianPosition(earthquake);
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

/* Color interpolation */
function getCesiumColor(e){
    return new Cesium.Color(settings.selectedColorInterpolation(0, e),
                            settings.selectedColorInterpolation(1, e),
                            settings.selectedColorInterpolation(2, e), 1);
}

function interpolateColorByTime(idx, e){
    const time = e.origin.time;
    const step = generalEqInfo.stepTimeInterval;
    if(time <= (generalEqInfo.minLongTime + step)){
        return interpolate(green[idx], yellow[idx], normalizeT(time, generalEqInfo.minLongTime, generalEqInfo.minLongTime+step));
    } else if(time <= (generalEqInfo.minLongTime+ (2*step))){
        return interpolate(yellow[idx], orange[idx], normalizeT(time, generalEqInfo.minLongTime + step, generalEqInfo.minLongTime + (2*step)));
    }else {
        return interpolate(orange[idx], red[idx], normalizeT(time, generalEqInfo.minLongTime+(2*step), generalEqInfo.maxLongTime));
    }

}

function interpolateColorByDepth(inx, e){
    const depth = e.origin.depth;
    if(depth <= (generalEqInfo.minDepth + generalEqInfo.depthStep)){
        return interpolate(green[inx], yellow[inx], normalizeT(depth, generalEqInfo.minDepth, generalEqInfo.minDepth + generalEqInfo.depthStep));
    } else if(depth <= (generalEqInfo.minDepth+ (2*generalEqInfo.depthStep))){
        return interpolate(yellow[inx], orange[inx], normalizeT(depth, generalEqInfo.minDepth+generalEqInfo.depthStep, generalEqInfo.minDepth + (2*generalEqInfo.depthStep)));
    }else {
        return interpolate(orange[inx], red[inx], normalizeT(depth, generalEqInfo.minDepth+(2*generalEqInfo.depthStep), generalEqInfo.maxDepth));
    }

}

function interpolateColorByMagnitude(inx, e){
    const magnitude = e.magnitude.magnitude;
    if(magnitude <= 3){
        return interpolate(green[inx], yellow[inx], normalizeT(magnitude, 0, 3));
    } else if(magnitude <= 6){
        return interpolate(yellow[inx], red[inx], normalizeT(magnitude, 3, 6));
    }else {
        return red[inx];
    }

}


function getPixelSize(e) {
    const magnitude = e.magnitude.magnitude;
    return interpolate(minimumPixelSize, maximumPixelSize, normalizeT(magnitude, 0, maxMagnitude));
}


function getScaleByDistance() {
    return defaultScaleByDistance;
}

function magnitudeNearFarScalar(earthquake, index, count) {
    var magnitude = earthquake.magnitude.magnitude;
    return getBestPerformanceNearFarScalar(magnitude, index, count);
}

//TODO: review
function getBestPerformanceNearFarScalar(magnitude, index, count){
    if(index > count - lowNumber) {
        return new Cesium.NearFarScalar(1.5e6 * (magnitude), 0.9, 1.5e7 * (magnitude), 0.0);
    }else if(index > count - mediumNumber){
        return new Cesium.NearFarScalar(1.5e4 * (magnitude), 0.9, 3e6 * (magnitude), 0.0);
    }else if (index > count - bigNumber){
        return new Cesium.NearFarScalar(interpolate(1.5e4, 4.5e4, normalizeT(magnitude, 2, 3)), 0.9,
                                        interpolate(3e5, 9e5, (magnitude - 2)), 0.0);

    }

    return new Cesium.NearFarScalar(interpolate(1.5e3, 5e3, normalizeT(magnitude, 0, 2)), 0.9,
                                    interpolate(1e4, 5e4, (magnitude/2)), 0.0);
}


//Set up earthquake info functions.
function setUpDateRange(earthquakes){
    if(earthquakes.length > 0 ) {
        generalEqInfo.maxLongTime = earthquakes[0].origin.time;
        generalEqInfo.minLongTime = earthquakes[earthquakes.length - 1].origin.time;
        generalEqInfo.timeInterval = generalEqInfo.maxLongTime - generalEqInfo.minLongTime;
        if(generalEqInfo.timeInterval == 0){
            generalEqInfo.timeInterval = 3.6e+6; //1 hour in ms
        }
        generalEqInfo.stepTimeInterval = generalEqInfo.timeInterval / 3;
    }
}


function setUpDepth(earthquakes){
    generalEqInfo.minDepth = 900000;
    generalEqInfo.maxDepth = -1000;

    for( var i = 0; i < earthquakes.length; i++){
        var e = earthquakes[i];
        if(e.origin.depth > generalEqInfo.maxDepth){
            generalEqInfo.maxDepth = e.origin.depth;
        }else if(e.origin.depth < generalEqInfo.minDepth){
            generalEqInfo.minDepth = e.origin.depth;
        }
    }
    generalEqInfo.depthInterval = generalEqInfo.maxDepth - generalEqInfo.minDepth;
    generalEqInfo.depthStep = generalEqInfo.depthInterval/3;

    //base case. No difference between the depths
    if(generalEqInfo.depthStep == 0){
        generalEqInfo.depthStep = 0.1;
    }

}

function get3dPosition(e){
    return Cesium.Cartesian3.fromDegrees(e.origin.longitude, e.origin.latitude, (generalEqInfo.maxDepth - e.origin.depth));
}

function get2dPosition(e){
    return Cesium.Cartesian3.fromDegrees(e.origin.longitude, e.origin.latitude, e.magnitude.magnitude);
}

/* CLICK ACTIONS */
screenHandler.setInputAction(function (click) {
    settings.singleClickHandler(click);

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

function singleClickUnderlineEarthquake(click){
    resetCameraRotationCenter();
    closeBarMenu();
    var pickedObject = viewer.scene.pick(click.position);
    //selectedObjects on nothing
    if(pickedObject === undefined){
        if(!settings.intensityMode) {
            resetLastPoint();
        }
        closeInfoBox();
    }else if(pickedObject.id === undefined){
        //pick entity-intensity
        showInfoBox(selectedObjects.intensity.earthquake);
    }else {
        changeSelectedPoint(pickedObject.primitive);
    }

}
function changeSelectedPoint(earthquakePoint) {
    //selectedObjects on the same object
    if (selectedObjects.pickedPoint !== undefined) {
        if (earthquakePoint.id === selectedObjects.pickedEarthquake) {
            showInfoBox(selectedObjects.pickedEarthquake);
            return;
        }
    }
    //selectedObjects on other object
    resetLastPoint();
    switchUnderlinePoint(earthquakePoint);
    underLinePoint();
    showInfoBox(selectedObjects.pickedEarthquake);

}

function switchUnderlinePoint(earthquakePoint){
    selectedObjects.pickedEarthquake = earthquakePoint.id;
    selectedObjects.pickedPoint = earthquakePoint;

}
function resetLastPoint(){
    if(selectedObjects.pickedPoint !== undefined) {
        if(!settings.intensityMode && !settings.timeLineMode) {
            selectedObjects.pickedPoint.show = true;
        }
        selectedObjects.selectedPoint.show = false;
        // selectedObjects.pickedPoint = undefined;
        // selectedObjects.pickedEarthquake = undefined;
    }
}

function hideUnderlinePint(){
    if(selectedObjects.selectedPoint !== undefined) {
        selectedObjects.selectedPoint.show = false;
    }
}


function underLinePoint(){
    if(selectedObjects.pickedPoint !== undefined){
        clonePoint(selectedObjects.pickedPoint, selectedObjects.selectedPoint);
        selectedObjects.pickedPoint.show = false;
        selectedObjects.selectedPoint.show = true;
        selectedObjects.selectedPoint.translucencyByDistance = undefined;
        selectedObjects.selectedPoint.outlineColor = Cesium.Color.fromCssColorString(computeColorComplement(selectedObjects.selectedPoint.color.red, selectedObjects.selectedPoint.color.green, selectedObjects.selectedPoint.color.blue));
        selectedObjects.selectedPoint.color.alpha = 0.999;
        selectedObjects.selectedPoint.outlineWidth = 3;
    }

}

function showAllPoints(){
    if(!settings.timeLineMode) {
        for (var i = 0; i < earthquakes.length; i++) {
            earthquakes[i].primitivePoint.show = true;
        }
    }else{
        for(var key in dict) {
            var e = dict[key];
            e.primitivePoint.show = true;
        }
    }
}

//TODO end point of an error. time line + search cause the effect
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


//Double selectedObjects
screenHandler.setInputAction(function(click) {
    settings.doubleClickHandler(click);

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
    underLinePoint(selectedObjects.pickedPoint, selectedObjects.pickedEarthquake);
    settings.setCaption();
}

function updatePointsPosition(){
    for( var i = 0; i < earthquakes.length; i++){
        earthquakes[i].primitivePoint.position = settings.getCartesianPosition(earthquakes[i]);
    }
    viewer.camera.setView({
                              orientation: {
                                  heading: 0.0,
                                  pitch: -Cesium.Math.PI_OVER_TWO,
                                  roll: 0.0
                              }});
    underLinePoint(selectedObjects.pickedPoint, selectedObjects.pickedEarthquake);
    resetCameraRotationCenter();

}

function removeSelectedPoint(){
    if(selectedObjects.selectedPoint !== undefined){
        resetLastPoint();
        points.remove(selectedObjects.selectedPoint);
    }
}


function addSelectedPoint(){
    return points.add({
      show : false,
      scaleByDistance : getScaleByDistance()
  });
}

/* DRAW Intensity */
function drawIntensity(intensity){
    removeAllIntensity();
    var groundGrid = getGridList(intensity)
    var maxDistance = getMaxDistance(groundGrid, intensity.earthquake);
    for(var i = 0; i < groundGrid.length - 1; i++) {
        var instances = [];
        for(var j = 0; j < groundGrid[0].length - 1; j++) {

            var color = getIntensityPointColor(groundGrid, i, j);
            var lat = groundGrid[i][j].latitude;
            var lng = groundGrid[i][j].longitude;
            var distance = haversine(lat, lng, intensity.earthquake.origin.latitude, intensity.earthquake.origin.longitude);


            if(distance < maxDistance) {
                var nextLat =  groundGrid[i+1][j+1].latitude;
                var nextLng = groundGrid[i+1][j+1].longitude;

                var coordinates = Cesium.Rectangle.fromDegrees(lng, nextLat, nextLng, lat);
                var instance = new Cesium.GeometryInstance({
                                                               releaseGeometryInstances : false,
                                                               interleave : false,
                                                               geometry: new Cesium.RectangleGeometry(
                                                                   {
                                                                       rectangle: coordinates,
                                                                       vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                                                                   }),
                                                               attributes: {
                                                                   color: new Cesium.ColorGeometryInstanceAttribute(
                                                                       color[0], color[1], color[2],
                                                                       color[3])
                                                               }
                                                           });
                instances.push(instance);
            }

        }
        scene.primitives.add(new Cesium.Primitive({
                                                      geometryInstances : instances,
                                                      appearance : new Cesium.PerInstanceColorAppearance()
                                                  }));

    }
}

function getIntensityPointColor(groundGrid, i, j){
    let m = groundGrid[i][j];
    let nextMotionGround = groundGrid[i][j+1];
    let color = getIntensityColor(m.mmi);
    let rightColor = getIntensityColor(nextMotionGround.mmi);
    return averageColor(color, rightColor);
}

function getMaxDistance(groundGrid, earthquake){
    let north = groundGrid[0][Math.floor((groundGrid[0].length-1)/2)];
    let south = groundGrid[Math.floor(groundGrid.length-1)][Math.floor(groundGrid[groundGrid.length-1].length/2)];
    let northLat = north.latitude;
    let northLng = north.longitude;
    let maxDistance = haversine(northLat, northLng, earthquake.origin.latitude, earthquake.origin.longitude);

    let southDistance = haversine(south.latitude, south.longitude, earthquake.origin.latitude, earthquake.origin.longitude);
    if(southDistance < maxDistance){
        maxDistance = southDistance;
    }

    return maxDistance;
}

function getGridList(intensity){
    let groundGrid = [[]];
    let row = 0;
    for(var i = 0; i < intensity.motionGroundList.length; i++){

        var motionGround = {
            latitude : intensity.motionGroundList[i][0],
            longitude :  intensity.motionGroundList[i][1],
            mmi : intensity.motionGroundList[i][2],
        };
        groundGrid[row].push(motionGround);

        if(i+1 < intensity.motionGroundList.length && motionGround.latitude != intensity.motionGroundList[i+1][0]){
            groundGrid.push([]);
            row++;
        }
    }
    return groundGrid;
}

function getIntensityColor(intensity){
    let index = Math.floor(intensity) - 1;
    let firstColor;
    let secondColor;
    if (index >= color.length-1) {
        firstColor = color[color.length - 1];
        secondColor = firstColor;
    }else{
        firstColor = color[index];
        secondColor = color[index + 1];
    }

    return getColorInterpolationByIntensity(intensity, firstColor, secondColor);

}


function getColorInterpolationByIntensity(intensity, firstColor, secondColor){
    var comp1 = interpolate(firstColor[0], secondColor[0], normalizeT(intensity, Math.floor(intensity),  Math.floor(intensity) +1 ));
    var comp2 = interpolate(firstColor[1], secondColor[1], normalizeT(intensity, Math.floor(intensity),  Math.floor(intensity) +1 ));
    var comp3 = interpolate(firstColor[2], secondColor[2], normalizeT(intensity, Math.floor(intensity),  Math.floor(intensity) +1 ));
    var comp4 = firstColor[3];

    return [comp1, comp2, comp3, comp4];
}

function hideIntensity(){
    for(var i = 2; i < scene.primitives; i++){
        scene.primitives.get(i).show = false;

    }
}

function removeAllIntensity(){
    for(var i = scene.primitives.length-1; i > 1; i--){
        scene.primitives.remove(scene.primitives.get(i))
    }
}

function findEarthquakeById(id){
    for(var i in earthquakes){
        var e = earthquakes[i];
        if(e.id == id){
            return e;
        }
    }
}

function findEarthquakeByIntensityId(id){
    for(var i in earthquakes){
        var e = earthquakes[i];
        if(e.intensity.id == id){
            return e;
        }
    }
}

function cancelIntensity(){
    $(".earthquake-info-button").css("color", "");
    removeAllIntensity();
    showAllPoints();
    underLinePoint();
    console.log("aho");
    settings.intensityMode = false;
    settings.setCaption()
}



/* SETTINGS */
function changePositionMode(mode){
    switch (mode){
        case "3dMode":
            settings.getCartesianPosition = get3dPosition;
            settings.depthMode = true;
            break;
        case "2dMode":
            settings.getCartesianPosition = get2dPosition;
            settings.depthMode = false;
    }
}

function changeOnClickHandler(mode){
    if(!play) {
        switch (mode) {
            case "3dMode":
                settings.doubleClickHandler = doubleClickHandler3d;
                settings.singleClickHandler = singleClickUnderlineEarthquake;
                break;
            case "2dMode":
                settings.doubleClickHandler = doubleClickHandler2d;
                settings.singleClickHandler = singleClickUnderlineEarthquake;
                break;
            case "playerMode":
                settings.doubleClickHandler = function () {};
                settings.singleClickHandler = closeBarMenu;
        }
    }
}

function showIntensity(element){
    let e = findEarthquakeById($(element).parent().parent().attr("id"));
    if(settings.intensityMode && selectedObjects.pickedEarthquake.id == e.id) {
        cancelIntensity();
    }else{
        $(".earthquake-info-button").css("color", "");
        $(element).css("color", "black");
        if (e.intensity.motionGroundList === undefined) {
            findIntensityById(e.intensity.id, afterIntensityRequest);
        } else {
            afterIntensityRequest(e.intensity);
        }
        settings.intensityMode = true;
        switchUnderlinePoint(e.primitivePoint);
        hideUnderlinePint();
        showInfoBox(e);
        setCaptionByIntensity()
    }
}


function changeColorOption(colorOption){

        if (colorOption === "magnitude") {
            settings.selectedColorInterpolation = interpolateColorByMagnitude;
            settings.setCaption = setCaptionByMagnitude;

        } else if (colorOption === "date") {
            settings.selectedColorInterpolation = interpolateColorByTime;
            settings.setCaption = setCaptionByDate;
        } else if (colorOption === "depth") {
            settings.selectedColorInterpolation = interpolateColorByDepth;
            settings.setCaption = setCaptionByDepth;
        }
        if(!settings.intensityMode) {
            updatePointsColor();
        }

}

const colorMode = ["magnitude", "date", "depth"];
var selectedColorIndex = 0;

function nextColorMode(){
    if(!settings.intensityMode) {
        selectedColorIndex++;
        if (selectedColorIndex == colorMode.length) {
            selectedColorIndex = 0;
        }

        changeColorOption(colorMode[selectedColorIndex]);
        $("#color-selector select").val(selectedColorIndex).change();
    }
}

function prevColorMode(){
    if(!settings.intensityMode) {
        selectedColorIndex--;
        if (selectedColorIndex == -1) {
            selectedColorIndex = colorMode.length - 1;
        }

        changeColorOption(colorMode[selectedColorIndex]);
        $("#color-selector select").val(selectedColorIndex).change();
    }
}

function changeView(view){
    const iconClasses = ["fa fa-video-camera", "fa fa-info"];
    switch (view){
        case "timeline":
            if(!settings.timeLineMode) {
                setUpTimeLineView();
            }
            settings.footerIndex = 1;
            showPlayer();
            break;
        case "legend":
            settings.footerIndex = 0;
            hidePlayer();
            break;
    }
    $("#arrow-footer-up").attr("class", iconClasses[settings.footerIndex]);
}

function nextFooterView(){
    const footerViews = ["legend", "timeline"];
    settings.footerIndex++;
    if(settings.footerIndex == footerViews.length){
        settings.footerIndex = 0;
    }
    changeView(footerViews[settings.footerIndex]);
    $("#time-view-selector select").val(settings.footerIndex).change();
}