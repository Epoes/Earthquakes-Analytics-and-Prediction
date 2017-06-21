
var extent = Cesium.Rectangle.fromDegrees(0.0, 32.0, 20.0, 53.0);

Cesium.BingMapsApi.defaultKey = "AjE_qTx15RrWAEQV5xQQuEg3qUvjtly009hVaEFGsIWOigXnhXFaj984NfDYzvdx";
Cesium.MapboxApi.defaultAccessToken = "pk.eyJ1IjoiZXBvZXMiLCJhIjoiY2oyZ2NvM2kwMDAwYTRhbWUxZGl0MHZqdyJ9.eOUixw7uaM7mitSFFcMvsg";
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

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
    // baseLayerPicker : false,
    //Use OpenStreetMaps
    imageryProvider : new Cesium.MapboxImageryProvider({
        url: 'https://api.mapbox.com/v4/',
        mapId: 'mapbox.streets',
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

    // creditContainer: 'credit'

});


var scene = viewer2.scene;

scene.debugShowFramesPerSecond = true;

var elevations;
var epicentres;

$(document).ready(function () {
    doRequest(stdRequest);
})
var unit = 911.3862583;
var unitFake = 1000.4257813;
var maxDepth = 35000;
var geometry = new Cesium.BoxGeometry.fromDimensions({
    vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
    dimensions : new Cesium.Cartesian3(unit, unit, unit)
});


function drawItaly(data){
    var primitivesArray = [];
    for(var i = 0; i < data.length; ++i){
        var elevation = data[i];
        var height = convertHeight(elevation.elevation);

        primitivesArray.push(new Cesium.GeometryInstance({
                            geometry : geometry,
                            modelMatrix : Cesium.Matrix4.multiplyByTranslation(
                                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(elevation.longitude, elevation.latitude)),
                                new Cesium.Cartesian3(0.0, 0.0, height + maxDepth), new Cesium.Matrix4()),
                            id : elevation,
                            attributes : {
                                color : new Cesium.ColorGeometryInstanceAttribute(interpolateHeights(0, height), interpolateHeights(1, height), interpolateHeights(2, height),0.2)
                            }
                        })
                    );
        if(i % 1024 === 0){
            scene.primitives.add(new Cesium.Primitive({
                geometryInstances : primitivesArray,
                appearance : new Cesium.PerInstanceColorAppearance({translucent : true})
            }));
            primitivesArray = [];
        }
    }
    scene.primitives.add(new Cesium.Primitive({
                geometryInstances : primitivesArray,
                appearance : new Cesium.PerInstanceColorAppearance({translucent : true})
            }));
    primitivesArray = [];
    // primitivesArray = drawSide(data, primitivesArray, 1024, geometry);
    scene.primitives.add(new Cesium.Primitive({
        geometryInstances : primitivesArray,
        appearance : new Cesium.PerInstanceColorAppearance({translucent : true})
    }));
}

function drawSide(data, primitivesArray, length, geometry){
    for(var i = 0; i < length; ++i){
        for(var j = maxDepth; j > 0; j-=unit) {
            var elevation = data[i];
            var height = convertHeight(elevation.elevation);
            primitivesArray.push(new Cesium.GeometryInstance({
                    geometry: geometry,
                    modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                        Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(elevation.longitude, elevation.latitude)),
                        new Cesium.Cartesian3(0.0, 0.0, j + height - unit), new Cesium.Matrix4()),
                    id: elevation,
                    attributes: {
                        color: new Cesium.ColorGeometryInstanceAttribute(interpolateHeights(0, 6000), interpolateHeights(1, 6000), interpolateHeights(2, 6000), 0.2)
                    }
                })
            );
        }
            scene.primitives.add(new Cesium.Primitive({
                geometryInstances : primitivesArray,
                appearance : new Cesium.PerInstanceColorAppearance()
            }));
            primitivesArray = [];
    }
    return primitivesArray;
}
var cyan = [0.529412, 0.807843, 0.980392];
var deep_blue = [0.0, 0.0, 0.501961];
var ground_green = [0.4352941176, 0.9098039216, 0.8039215686];
var brown_light = [0.721569, 0.52549, 0.0431373];
var brown = [0.2862745098, 0.1725490196, 0.05098039216];
var white = [1.0,1.0,1.0];

var green = [0.0,1.0,0.0];
var yellow = [1.0,1.0,0.0];
var red = [1.0,0.0,0.0];
var purple = [0.0,0.0,1.0];

function interpolateHeights(index, height){
    if(height < -10){
        return interpolate(cyan[index], deep_blue[index], -height/(2*unit));
    }
    if(height <= 2*unit){
        return interpolate(ground_green[index], brown_light[index], height/(2*unit));
    } else if(height <= 4*unit){
        return interpolate(brown_light[index], brown[index], (height-(2*unit))/(2*unit));
    }else {
        return interpolate(brown[index], white[index], (height-(4*unit))/(2*unit));
    }
}

function interpolateColorByMagnitude(inx, e){
    var magnitude = e.magnitude.magnitude;
    if(magnitude == null){
        magnitude = e.magnitude;
    }
    if(magnitude < 3){
        return interpolate(green[inx], yellow[inx], magnitude/3);
    } else if(magnitude <= 6){
        return interpolate(yellow[inx], red[inx], (magnitude-3)/3);
    }else {
        return interpolate(red[inx], purple[inx], (magnitude-6)/4);
    }

}

function normalizeT(value, min, max){
    return (value - min) / (max - min);
}

function interpolate(a, b, t){
    return (a + (b-a)*t);
}


function convertHeight(height){
    return ((Math.floor(height*2/(unit))) + 1) * (unit);
}

var centerBoundings = [43.961401, 14.452927, 42.424652, 10.050827];
var italyBoundings = [48.00, 35.00, 19.00, 5.00];

var stdRequest = {
    count : 1,
    endTime : new Date(),
    startTime : new Date("1985.01.01"),
    minMag : 3,
    maxMag : 9,
    minDepth : 0,
    maxDepth : 20000,
    minPoint : {
        longitude: centerBoundings[3],
        latitude: centerBoundings[2]
    },
    maxPoint : {
        longitude: centerBoundings[1],
        latitude: centerBoundings[0]
    }
};

// stdRequest.startTime.setDate(stdRequest.startTime.getDate() - 100000000);

function doRequest(request){
    // $.ajax({
    //     // url: "http://" + window.location.host + "/api/elevations/query?minele=-4200",
    //     url: "http://" + window.location.host + "/api/elevations/query",
    //     type: "GET",
    //     success: function (data, textStatus, jqXHR) {
    //         elevations = data;
    //         drawItaly(elevations);
    //     }
    // });

    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/query?count=" + request.count + "&start_time="+ formatDateForQuery(request.startTime)
        + "&end_time=" + formatDateForQuery(request.endTime) + "&max_magnitude=" + request.maxMag
        + "&min_magnitude=" + request.minMag + "&min_depth=" + request.minDepth + "&max_depth=" + request.maxDepth
        + "&min_lat=" + request.minPoint.latitude + "&min_lng=" + request.minPoint.longitude
        + "&max_lat=" + request.maxPoint.latitude + "&max_lng=" + request.maxPoint.longitude,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            epicentres = data;
            drawEarthquake(epicentres);
            getStationMagnitudes(epicentres);
        }
    })
}

function getStationMagnitudes(epicentres) {
    var min_magnitude = 2.5;
    var max_magnitude = 8;
    for(var i = 0; i < epicentres.length; ++i) {
        var earthquake = epicentres[i];
        $.ajax({
            url: "http://" + window.location.host + "/api/earthquakes/stationMagnitudes/query?earthquake_id=" + earthquake.id + "&min_magnitude=" + min_magnitude + "&max_magnitude=" + max_magnitude,
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                drawStationMagnitudes(data);
            }
        })
    }
}

function drawStationMagnitudes(data) {
    var primitivesArray = [];
    for(var i = 0; i < data.length; ++i){
        var earthquake = data[i];
        var height = convertHeight(earthquake.station.elevation);
        var stationMagnitude = new Cesium.GeometryInstance({
            geometry: geometry,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(earthquake.station.longitude, earthquake.station.latitude)),
                new Cesium.Cartesian3(0.0, 0.0, height + maxDepth), new Cesium.Matrix4()),
            id: earthquake,
            attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, earthquake), interpolateColorByMagnitude(1, earthquake), interpolateColorByMagnitude(2, earthquake))
            }
        });
        primitivesArray.push(stationMagnitude);
    }
    var primitive = new Cesium.Primitive({
        geometryInstances : primitivesArray,
        appearance: new Cesium.PerInstanceColorAppearance({translucent: false})
    });

    scene.primitives.add(primitive);
}

function drawEarthquake(data){
    var primitivesArray = [];
    var neighborArray = [];
    var primitiveNeighborood;
    for(var i = 0; i < data.length; ++i){
        var earthquake = data[i];
        var height = convertHeight(-earthquake.origin.depth);
        var epicentre = new Cesium.GeometryInstance({
            geometry: geometry,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(earthquake.origin.longitude, earthquake.origin.latitude)),
                new Cesium.Cartesian3(0.0, 0.0, height + maxDepth), new Cesium.Matrix4()),
            id: earthquake,
            attributes: {
                // color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, earthquake), interpolateColorByMagnitude(1, earthquake), interpolateColorByMagnitude(2, earthquake), 0.3)
                color: new Cesium.ColorGeometryInstanceAttribute(1, 0, 0, 0.3)

            }
        });
        primitivesArray.push(epicentre);
        // neighborArray = drawEpicentreNeighborood(epicentre, height, neighborArray);
    }
    var primitive = new Cesium.Primitive({
        geometryInstances : primitivesArray,
        appearance : new Cesium.PerInstanceColorAppearance({translucent: false})
    });
    // console.log(primitivesArray);
    scene.primitives.add(primitive);
    // primitive.readyPromise.then(function (primitive) {
    //     var attributes = primitive.getGeometryInstanceAttributes(earthquake);
    //     attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom({alpha: 1.0}));
    // });
    // console.log(data);
}


function drawEpicentreNeighborood(epicentre, height, neighborArray) {
    var limit = Math.floor(epicentre.id.magnitude.magnitude);
    var starting_point_x = limit * unit;
    var starting_point_y = limit * unit;
    var starting_point_z = limit * unit;
    for(var i = starting_point_x; i > -starting_point_x - unit; i-=unit){

        var neighbor = new Cesium.GeometryInstance({
            geometry: geometry,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(epicentre.id.origin.longitude, epicentre.id.origin.latitude)),
                new Cesium.Cartesian3(-i, 0, height + maxDepth), new Cesium.Matrix4()),
            id: epicentre.id,
            attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, epicentre.id), interpolateColorByMagnitude(1, epicentre.id), interpolateColorByMagnitude(2, epicentre.id), 0.3)
            }
        });
        neighborArray.push(neighbor);
        for(var j = starting_point_y; j > -starting_point_y - unit; j-=unit){
            var neighbor = new Cesium.GeometryInstance({
                geometry: geometry,
                modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                    Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(epicentre.id.origin.longitude, epicentre.id.origin.latitude)),
                    new Cesium.Cartesian3(-i, -j, height + maxDepth), new Cesium.Matrix4()),
                id: epicentre.id,
                attributes: {
                    color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, epicentre.id), interpolateColorByMagnitude(1, epicentre.id), interpolateColorByMagnitude(2, epicentre.id), 0.3)
                }
            });
            neighborArray.push(neighbor);
            for(var z = starting_point_z; z > -starting_point_z - unit; z-=unit){
                var neighbor = new Cesium.GeometryInstance({
                    geometry: geometry,
                    modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                        Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(epicentre.id.origin.longitude, epicentre.id.origin.latitude)),
                        new Cesium.Cartesian3(-i,  -j, -z + height + maxDepth), new Cesium.Matrix4()),
                    id: epicentre.id,
                    attributes: {
                        color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, epicentre.id), interpolateColorByMagnitude(1, epicentre.id), interpolateColorByMagnitude(2, epicentre.id), 0.3)
                    }
                });
                neighborArray.push(neighbor);
            }
        }
    }
    scene.primitives.add(new Cesium.Primitive({
        geometryInstances : neighborArray,
        appearance : new Cesium.PerInstanceColorAppearance()
    }));
    // console.log(neighborArray);

    neighborArray = [];
    return neighborArray;
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].modelMatrix === obj.modelMatrix) {
            console.log("dentro");
            return true;
        }
    }

    return false;
}

screenHandler = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas);
handler.setInputAction(function (click) {

console.log(scene.pick(click.position));
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function(click) {
    // doubleClickHandler(selectedObjects);

}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

const zoomFactor = 1.3;

function doubleClickHandler(click){
    var pickedObject = scene.pick(click.position);
    var cameraHeight = scene.camera.positionCartographic.height;
    if(pickedObject !== undefined) {
        var id = pickedObject.id;
        for (var i = 0; i < elevations.length; i++) {
            var e = elevations[i];
            if (e.id === id) {
                console.log(Cesium.Ellipsoid.WGS84.cartesianToCartographic(Cesium.Matrix4.getTranslation(pickedObject.primitive.modelMatrix, new Cesium.Cartesian3())));
                var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(Cesium.Matrix4.getTranslation(pickedObject.primitive.modelMatrix, new Cesium.Cartesian3()));
                var pointHeight = cartographicPosition.height;
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
    viewer2.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
            e.longitude,
            e.latitude,
            height),
        orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0.0
        }});
}