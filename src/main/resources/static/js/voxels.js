
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


var scene = viewer2.scene;


scene.debugShowFramesPerSecond = true;

var elevations = [];
var northElevations = [];
var centreElevations = [];
var southElevations = [];
var epicentres = [];
var stationMagnitudes = [];
var stationMagnitudes2 = [];
var arrivals = [];
var stations = [];
var nextStation = 0;
var nextDistance = 0;
var maxDistance = 0;
var oldDistance = 0;
var currentTime = 0;
var startTime = 0;
var endTime = 30000;
var elevationPoints = [];
var attributes = [];
var oldColors = [];
var pins;
var sortedNeighbors;
var neighInterval;
var circleId;

var italyPartition = 0;
var italyDistance;
var italyMax;
var italyMin;
var offset = 2;
var heightExageration = 10;

$(document).ready(function () {
    doRequest(stdRequest);
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
$("#generate-full-italy").click(function() {
    doItalyRequest(elevations)
});

$("#generate-north-italy").click(function() {
    maxLon = 19;
    minLon = 5;
    maxLat = 48;
    minLat = 44;
    doItalyRequest(northElevations, maxLat, minLat, maxLon, minLon)
});

$("#generate-centre-italy").click(function() {
    maxLon = 19;
    minLon = 5;
    maxLat = 44;
    minLat = 41.7;
    doItalyRequest(centreElevations, maxLat, minLat, maxLon, minLon)
});

$("#generate-south-italy").click(function() {
    maxLon = 19;
    minLon = 5;
    maxLat = 41.7;
    minLat = 35;
    doItalyRequest(southElevations, maxLat, minLat, maxLon, minLon)
});

var showSt = false;
$("#show-stations").click(function () {
    if(!showSt) {
        $("#show-stations").children().text("Hide Stations");
        showSt = !showSt;
        viewer2.entities.show = !viewer2.entities.show;
    } else {
        $("#show-stations").children().text("Show Stations");
        showSt = !showSt;
        viewer2.entities.show = !viewer2.entities.show;
    }
});

var unit = 911.3862583;
var unitFake = 1000.4257813;
var maxDepth = 35000;
var geometryElevation = new Cesium.BoxGeometry.fromDimensions({
    vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
    dimensions : new Cesium.Cartesian3(unit, unit, unit)
});

var geometryStation = new Cesium.BoxGeometry.fromDimensions({
    vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
    dimensions : new Cesium.Cartesian3(unit, unit, unit)
});

function drawItaly(data){
    var primitivesArray = [];
    italyMax = data[0].latitude;
    italyMin = data[data.length - 1].latitude;
    italyDistance = italyMax - italyMin;
    for(var i = 0; i < data.length - 1; ++i){
        var elevation = data[i];
        var height = convertItalyHeight(elevation.elevation);

        var primitive = new Cesium.GeometryInstance({
            geometry : geometryElevation,
            modelMatrix : Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(elevation.longitude, elevation.latitude)),
                new Cesium.Cartesian3(0.0, 0.0, height + maxDepth), new Cesium.Matrix4()),
            id : elevation,
            attributes : {
                color : new Cesium.ColorGeometryInstanceAttribute(interpolateHeights(0, height), interpolateHeights(1, height), interpolateHeights(2, height), 0.3)
            }
        });
        elevation.primitivePoint = primitive;
        primitivesArray.push(primitive);
        if(elevation.longitude - data[i+1].longitude > 0){
            scene.primitives.add(new Cesium.Primitive({
                geometryInstances : primitivesArray,
                appearance : new Cesium.PerInstanceColorAppearance({translucent : true}),
                releaseGeometryInstances: false
            }));
            primitivesArray = [];
            italyPartition++;
        }
    }
    scene.primitives.add(new Cesium.Primitive({
                geometryInstances : primitivesArray,
                appearance : new Cesium.PerInstanceColorAppearance({translucent : true}),
                releaseGeometryInstances: false
            }));
    italyPartition++;
    requestStations();
}

function drawSide(data, primitivesArray, length, geometry){
    for(var i = 0; i < length; ++i){
        for(var j = maxDepth; j > 0; j-=unit) {
            var elevation = data[i];
            var height = convertHeight(elevation.elevation);
            primitivesArray.push(new Cesium.GeometryInstance({
                    geometry: geometryElevation,
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
// var ground_green = [0.4352941176, 0.9098039216, 0.8039215686];
var ground_green = [0.133333, 0.545098, 0.133333];
var brown_light = [0.721569, 0.52549, 0.0431373];
var brown = [0.2862745098, 0.1725490196, 0.05098039216];
var ghost_white = [0.972549, 0.972549, 1];
var white = [1.0,1.0,1.0];

var green = [0.0,1.0,0.0];
var light_green = [0.678431, 1, 0.184314];
var yellow = [1.0,1.0,0.0];
var red = [1.0,0.0,0.0];
var dark_red = [0.698039, 0.133333, 0.13333];

function interpolateHeights(index, height){
    if(height < -heightExageration){
        return interpolate(cyan[index], deep_blue[index], -height/(heightExageration*unit));
    }
    if(height <= heightExageration*unit){
        return interpolate(ground_green[index], brown_light[index], height/(heightExageration*unit));
    } else if(height <= (2*heightExageration)*unit){
        return interpolate(brown_light[index], brown[index], (height-(heightExageration*unit))/(heightExageration*unit));
    }else {
        return interpolate(white[index], ghost_white[index], (height-((2*heightExageration)*unit))/(heightExageration*unit));
    }
}

function interpolateColorByMagnitude(inx, e){
    var magnitude = e.magnitude.magnitude;
    if(magnitude == null){
        magnitude = e.magnitude;
    }
    if(magnitude <= 3.4){
        return interpolate(light_green[inx], yellow[inx], normalizeT(magnitude, 3, 7.5));
    } else if(magnitude <= 4.8){
        return interpolate(yellow[inx], red[inx], normalizeT(magnitude, 3, 7.5));
    }else {
        return interpolate(red[inx], dark_red[inx], normalizeT(magnitude, 3, 7.5));
    }

}

function interpolateDistance(inx, dist, list){
    if(dist <= list / 4){
        return interpolate(dark_red[inx], red[inx], normalizeT(dist, 0, list));
    } else if(dist <= list / 2){
        return interpolate(yellow[inx], red[inx], normalizeT(dist, 0, list));
    } else {
        return interpolate(light_green[inx], yellow[inx], normalizeT(dist, 0, list));
    }
}

function interpolate(a, b, t){
    return (a + (b-a)*t);
}


function convertItalyHeight(height){
    return ((Math.floor(height*10/(unit))) + 1) * (unit);
}

function convertEarthquakeHeight(height){
    return ((Math.floor(height/(unit))) + 1) * (unit);
}
var centerBoundings = [43.961401, 14.452927, 42.424652, 10.050827];
var italyBoundings = [48.00, 35.00, 19.00, 5.00];

var stdRequest = {
    count : 100000,
    endTime : new Date(),
    startTime : new Date("1985.01.01"),
    minMag : 3,
    maxMag : 9,
    minDepth : 0,
    maxDepth : 20000,
    minPoint : {
        longitude: italyBoundings[3],
        latitude: italyBoundings[2]
    },
    maxPoint : {
        longitude: italyBoundings[1],
        latitude: italyBoundings[0]
    }
};

// stdRequest.startTime.setDate(stdRequest.startTime.getDate() - 100000000);

function doItalyRequest(objects, maxLat, minLat, maxLon, minLon){
    if(objects.length != 0 && elevations.length != 0){
        return;
    }
    var url;
    if(maxLat === undefined){
        url = "http://" + window.location.host + "/api/elevations/query?&minele=-4"
    } else{
        url = "http://" + window.location.host + "/api/elevations/query?maxlat=" + maxLat + "&minlat=" + minLat + "&maxlon=" + maxLon + "&minlon=" + minLon + "&minele=-4"
    }
    $.ajax({
        // url: "http://" + window.location.host + "/api/elevations/query?minele=-4200",
        url: url,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            switch(maxLat){
                case 48:
                    northElevations = data;
                    for(var i = 0; i < northElevations.length; ++i){elevations.push(northElevations[i]);}
                    drawItaly(northElevations);
                    break;
                case 44:
                    centreElevations = data;
                    for(var i = 0; i < centreElevations.length; ++i){elevations.push(centreElevations[i]);}
                    drawItaly(centreElevations);
                    break;
                case 41.7:
                    southElevations = data;
                    for(var i = 0; i < southElevations.length; ++i){elevations.push(southElevations[i]);}
                    drawItaly(southElevations);
                    break;
                default:
                    elevations = data;
                    drawItaly(elevations);
            }

        }
    });
}

function doRequest(request){
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
            // getStationMagnitudes(epicentres);
            // getArrivals(epicentres);
        }
    })
}



function getStationMagnitudes(objects, epicentre) {
    var min_magnitude = 2.5;
    var max_magnitude = 8;
    $.ajax({
        url: "http://" + window.location.host + "/api/earthquakes/stationMagnitudes/query?earthquake_id=" + epicentre.id + "&min_magnitude=" + min_magnitude + "&max_magnitude=" + max_magnitude,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            // console.log(data);
            stationMagnitudes = data;
            // stationMagnitudes2 = jQuery.extend([], stationMagnitudes.slice());
            startTime = new Date().getTime();
            currentTime = startTime;
            nextStation = 0;
            // scene.primitives.get(1).show = false;
            // setInterval(radiateFromEpicentre.bind(null, epicentre),64);
            radiateFromEpicentre(epicentre);
            // var ep  = getPrimitiveForEpicentre(epicentre.origin, computeNearestRegion(epicentre.origin.latitude));
            // console.log(ep);
            // ep.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.BLACK);
            // neighInterval = setInterval(checkNeighbor, 16);
            // drawStationMagnitudes(data);
            // setInterval(appearStations, 50);
            // var distances = computeDistances(stationMagnitudes, epicentre);
            // var propagationSphere = viewer2.entities.add({
            //     position: Cesium.Cartesian3.fromDegrees(epicentre.origin.longitude, epicentre.origin.latitude, convertHeight(-epicentre.origin.depth) + maxDepth),
            //     ellipsoid : {
            //         radii : new Cesium.Cartesian3(1000, 1000, 1000),
            //         material : Cesium.Color.RED.withAlpha(0.8),
            //     }
            // });
            // nextDistance++;
            // setInterval(changeSphereSize.bind(null, propagationSphere, distances), 64);
        }
    })
}


function checkNeighbor() {
    scene.primitives.get(1).show = false;
    if(nextStation < stationMagnitudes.length/2) {
        var attributes = getPrimitiveForStation(stationMagnitudes[nextStation], computeNearestRegion(stationMagnitudes[nextStation].station.latitude));
        // attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom({alpha: 1.0}));
        nextStation++
    } else {
        scene.primitives.get(1).show = true;
        clearInterval(neighInterval);
    }
}

function getPrimitiveForEpicentre(station, region){
    var selectedAttribute;
    var ids = [];
    var minId;
    for (var i = region - 5; i < region + 5; ++i) {
        if(i == 0){
            continue;
        }
        if(scene.primitives.get(i)) {
            var nearestElevation = computeNearestElevation(station, scene.primitives.get(i).geometryInstances);
            if(nearestElevation != undefined) {
                ids.push(nearestElevation);
            }
        }
    }
    if(ids.length > 0) {
        minId = computeNearestElevation(station, ids);
        for (var i = region - 5; i < region + 5; ++i) {
            if (i == 0) {
                continue;
            }
            if (scene.primitives.get(i)) {
                var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(minId.id);
                if (attribute != undefined) {
                    selectedAttribute = attribute;
                }
            }
        }
    }
    return selectedAttribute;
}

function computeNearestRegion(latitude){
    var x = normalizeT(latitude, italyMin, italyMax);
    return italyPartition - Math.floor(x * (italyPartition - 1) - 1) + offset;
}

function computeNearestElevation(station, elevations){
    var stationLatitude = station.latitude;
    var stationLongitude = station.longitude;
    var nearestElevation;
    var minDistance = 100000;
    for(var i = 0; i < elevations.length; ++i){
        var elevationLatitude = elevations[i].id.latitude;
        var elevationLongitude = elevations[i].id.longitude;
        var distance = haversine(stationLatitude, stationLongitude, elevationLatitude, elevationLongitude);
        if(distance < minDistance){
            nearestElevation = elevations[i];
            minDistance = distance;
        }
    }
    return nearestElevation;
}
function getPrimitiveForStation(station, region) {
    var selectedAttribute;
    var ids = [];
    var minId;
    for (var i = region - 5; i < region + 5; ++i) {
        if(scene.primitives.get(i)) {
            ids.push(computeNearestElevation(station.station, scene.primitives.get(i).geometryInstances));
        }
    }
    minId = computeNearestElevation(station.station, ids);
    for (var i = region - 5; i < region + 5; ++i) {
        if(scene.primitives.get(i)) {
            var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(minId.id);
            if (attribute != undefined) {
                selectedAttribute = attribute;
            }
        }
    }
    attributes.push(selectedAttribute);
    oldColors.push(selectedAttribute.color);
    selectedAttribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(interpolateColorByMagnitude(0, station), interpolateColorByMagnitude(1, station), interpolateColorByMagnitude(2, station), 0.5));
    var newAttr;
    var stationNeigh = [filterArray(minId.id.id - 1), filterArray(minId.id.id - 1024 - 1), filterArray(minId.id.id - 1024), filterArray(minId.id.id - 1024 + 1), filterArray(minId.id.id + 1), filterArray(minId.id.id + 1024 + 1), filterArray(minId.id.id + 1024), filterArray(minId.id.id + 1024 - 1)]
    for(var j = 0; j < stationNeigh.length; j++) {
        if(stationNeigh[j]) {
            region = computeNearestRegion(stationNeigh[j].latitude)
            for (var i = region - 5; i < region + 5; ++i) {
                var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(stationNeigh[j]);
                if (attribute != undefined) {
                    newAttr = attribute;
                }
            }
            attributes.push(newAttr);
            oldColors.push(newAttr.color);
            newAttr.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(interpolateColorByMagnitude(0, station), interpolateColorByMagnitude(1, station), interpolateColorByMagnitude(2, station), 0.5));

        }
    }
    return selectedAttribute;
}

function getPrimitiveById(station, region) {
    var selectedAttribute;
    var ids = [];
    var minId;
    for (var i = region - 5; i < region + 5; ++i) {
        if(i == 0){
            continue;
        }
        if(scene.primitives.get(i)) {
            var nearestElevation = computeNearestElevation(station, scene.primitives.get(i).geometryInstances);
            if(nearestElevation != undefined) {
                ids.push(nearestElevation);
            }
        }
    }
    if(ids.length > 0) {
        minId = computeNearestElevation(station, ids);
        for (var i = region - 5; i < region + 5; ++i) {
            if(i == 0){
                continue;
            }
            if (scene.primitives.get(i)) {
                var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(minId.id);
                if (attribute != undefined) {
                    selectedAttribute = attribute;
                }
            }
        }
        addPin(station, minId.id);
        selectedAttribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color.fromBytes(21, 29, 244, 255));
    }
    return selectedAttribute;
}

function addPin(station, elevation){
    var pinBuilder  = new Cesium.PinBuilder();
    pins = viewer2.entities.add({
        name: station.name,
        position: Cesium.Cartesian3.fromDegrees(elevation.longitude, elevation.latitude, convertItalyHeight(elevation.elevation) + maxDepth),
        billboard: {
            image: pinBuilder.fromText('S', Cesium.Color.DODGERBLUE, 24).toDataURL(),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scaleByDistance: new Cesium.NearFarScalar(1e5, 1.2, 10e6, 0.5)
        }
    });
}



/* To find the row, given Id --> formula = (id - 1)/numOfCols*/

function filterArray(property){
    return $.grep(elevations, function(e){ return e.id == property;})[0];
}


function getPrimitiveForEarthquake(station, region){
    var selectedAttribute;
    var ids = [];
    var minId;
    for (var i = region - 5; i < region + 5; ++i) {
        if(i == 0){
            continue;
        }
        if(scene.primitives.get(i)) {
            var nearestElevation = computeNearestElevation(station, scene.primitives.get(i).geometryInstances);
            if(nearestElevation != undefined) {
                ids.push(nearestElevation);
            }
        }
    }
    if(ids.length > 0) {
        minId = computeNearestElevation(station, ids);
        for (var i = region - 5; i < region + 5; ++i) {
            if (i == 0) {
                continue;
            }
            if (scene.primitives.get(i)) {
                var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(minId.id);
                if (attribute != undefined) {
                    selectedAttribute = attribute;
                }
            }
        }
    }
    return minId;
}
function radiateFromEpicentre(epicentre){
    scene.primitives.get(1).show = false;
    for(var k = 0; k < 1; ++k) {
    // if(nextStation < 3){
        var startingRow;
        var startingCol;
        var deltaRow;
        var deltaCol;
        var earthquake = getPrimitiveForEarthquake(epicentre.origin, computeNearestRegion(epicentre.origin.latitude));
        var stationMagnitude = getPrimitiveForEarthquake(stationMagnitudes[k].station, computeNearestRegion(stationMagnitudes[k].station.latitude));
        // var stationMagnitude = getPrimitiveForEarthquake(stationMagnitudes[nextStation].station, computeNearestRegion(stationMagnitudes[nextStation].station.latitude));
        var earthquakeRow = Math.floor((earthquake.id.id - 1) / 1024) + offset;
        var earthquakeCol = Math.floor((earthquake.id.id - 1) % 1024) + offset;
        var stationRow = Math.floor((stationMagnitude.id.id - 1) / 1024) + offset;
        var stationCol = Math.floor((stationMagnitude.id.id - 1) % 1024) + offset;
        if (earthquakeRow > stationRow) {
            startingRow = stationRow;
            deltaRow = earthquakeRow - stationRow;
        } else {
            deltaRow = stationRow - earthquakeRow;
            startingRow = earthquakeRow - 2 * deltaRow;
        }
        if (earthquakeCol > stationCol) {
            startingCol = 0;
            deltaCol = earthquakeCol - stationCol;
        } else {
            deltaCol = stationCol - earthquakeCol;
            startingCol = -2 * deltaCol;
        }
        var row = 0;
        var neighbors = [];

        for (var i = startingRow; i < startingRow + 2 * deltaRow; ++i) {
            for (var j = startingCol; j < 2 * deltaCol; ++j) {
                var neighbor = filterArray(stationMagnitude.id.id + j + row);
                // console.log(stationMagnitude.id.id + j + row - 1)
                // var neighbor = elevations[stationMagnitude.id.id + j + row - 1];
                neighbors.push(neighbor);
                // var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(neighbor);
                // if(attribute != undefined) {
                //     attribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
                // }
            }
            row += 1024;
        }
        sortedNeighbors = sortByDistance(epicentre, neighbors);
        // sortedNeighbors = neighbors;
        nextDistance = 0;
        // appearCircle(startingRow, deltaRow);
        // console.log(sortedNeighbors);
        circleId = setInterval(appearCircle.bind(null, startingRow, deltaRow), 16);
        // earthquakeAttribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
        // if(nextStation < stationMagnitudes.length/2) {
        //     var attributes = getPrimitiveById(stationMagnitudes[nextStation].station, computeNearestRegion(stationMagnitudes[nextStation].station.latitude));
        //     // attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom({alpha: 1.0}));
        //     nextStation++
        // } else {
        //     scene.primitives.get(1).show = true;
        // }
        nextStation++;
    // } else {
    //     scene.primitives.get(1).show = true;
    //     for(var k = 0; k < attributes.length; ++k){
    //         attributes[k].color = oldColors[k];
    //     }
    }
}

function appearCircle(startingRow, deltaRow){
    // for(var j = 0; j < sortedNeighbors.length; ++j) {
    if(nextDistance < sortedNeighbors.length) {
        for (var i = startingRow; i < startingRow + 2 * deltaRow; ++i) {
            if (scene.primitives.get(i)) {
                var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(sortedNeighbors[nextDistance]);
                // var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(sortedNeighbors[j]);
                if (attribute != undefined) {
                    attributes.push(attribute);
                    oldColors.push(attribute.color);
                    attribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(interpolateDistance(0, nextDistance, sortedNeighbors.length), interpolateDistance(1, nextDistance, sortedNeighbors.length), interpolateDistance(2, nextDistance, sortedNeighbors.length), 0.5));
                }
            }
        }
        nextDistance++;
    } else {
        scene.primitives.get(1).show = true;
        // for(var k = 0; k < attributes.length; ++k){
        //     attributes[k].color = oldColors[k];
        // }
        clearInterval(circleId);
    }
}

function sortByDistance(epicentre, neighbors){
    return mergeSort(neighbors, epicentre);
}

function mergeSort(array, epicentre){
    var len = array.length;
    if(len <2)
        return array;
    var mid = Math.floor(len/2),
        left = array.slice(0,mid),
        right = array.slice(mid);
    return merge(mergeSort(left, epicentre),mergeSort(right, epicentre), epicentre);
}


function merge(left, right, epicentre){
    var result = [],
        lLen = left.length,
        rLen = right.length,
        l = 0,
        r = 0;
    var epicLat = epicentre.origin.latitude;
    var epicLon = epicentre.origin.longitude;

    while(l < lLen && r < rLen){
        if(haversine(epicLat, epicLon, left[l].latitude, left[l].longitude) < haversine(epicLat, epicLon, right[r].latitude, right[r].longitude)){
            result.push(left[l++]);
        }
        else{
            result.push(right[r++]);
        }
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
}


function changeSphereSize(propagationSphere, distances){
    // if(nextDistance < distances.length) {
    //     propagationSphere.ellipsoid.radii = new Cesium.Cartesian3(distances[nextDistance], distances[nextDistance], distances[nextDistance])
    //     oldDistance = nextDistance;
    //     nextDistance++;
    // } else {
    //     nextDistance++;
    // }
    var curr = currentTime;
    currentTime = new Date().getTime() - startTime;
    var radiusPercent = normalizeT(currentTime, 0, maxDistance);
    if(radiusPercent > 1){
    }
    propagationSphere.ellipsoid.radii = new Cesium.Cartesian3(maxDistance * (radiusPercent), maxDistance * (radiusPercent), maxDistance * (radiusPercent));
}

function computeDistances(stationMagnitudes, epicentre){
    var epicLat = epicentre.origin.latitude;
    var epicLon = epicentre.origin.longitude;
    var distances = [];
    for(var i = 0; i < stationMagnitudes.length; ++i){
        var stationLat = stationMagnitudes[i].station.latitude;
        var stationLon = stationMagnitudes[i].station.longitude;
        var distance = haversine(epicLat, epicLon, stationLat, stationLon);
        distances.push(distance);
        if(distance > maxDistance){
            maxDistance = distance;
        }
    }
    return distances;
}

function getArrivals(objects, epicentres) {
    var phase = "";
    if(objects.length != 0){
        return;
    }
    for(var i = 0; i < epicentres.length; ++i){
        var earthquake = epicentres[i];
        $.ajax({
            url: "http://" + window.location.host + "/api/earthquakes/arrivals/query?earthquake_id=1895389&phase=" + phase,
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                arrivals = data
                drawArrivals(data);
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
            geometry: geometryStation,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(earthquake.station.longitude, earthquake.station.latitude)),
                new Cesium.Cartesian3(0.0, 0.0, height + maxDepth), new Cesium.Matrix4()),
            id: earthquake,
            attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, earthquake), interpolateColorByMagnitude(1, earthquake), interpolateColorByMagnitude(2, earthquake))
            }
        });
        // console.log(stationMagnitude);
        primitivesArray.push(stationMagnitude);
    }
    var primitive = new Cesium.Primitive({
        geometryInstances : primitivesArray,
        appearance: new Cesium.PerInstanceColorAppearance({translucent: false})
    });

    scene.primitives.add(primitive);
}

function drawArrivals(data) {
    var primitivesArray = [];
    for(var i = 0; i < data.length; ++i){
        var earthquake = data[i];
        var height = convertItalyHeight(earthquake.pick.station.elevation);
        var stationMagnitude = new Cesium.GeometryInstance({
            geometry: geometryElevation,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(earthquake.pick.station.longitude, earthquake.pick.station.latitude)),
                new Cesium.Cartesian3(0.0, 0.0, height + maxDepth), new Cesium.Matrix4()),
            id: earthquake,
            attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(0, 0, 1)
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
        var height = convertEarthquakeHeight(-earthquake.origin.depth);
        var epicentre = new Cesium.GeometryInstance({
            geometry: geometryElevation,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(earthquake.origin.longitude, earthquake.origin.latitude)),
                new Cesium.Cartesian3(0.0, 0.0, height + maxDepth), new Cesium.Matrix4()),
            id: earthquake,
            attributes: {
                // color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, earthquake), interpolateColorByMagnitude(1, earthquake), interpolateColorByMagnitude(2, earthquake), 0.3)
                color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, earthquake), interpolateColorByMagnitude(1, earthquake), interpolateColorByMagnitude(2, earthquake))

            }
        });
        primitivesArray.push(epicentre);
        drawEpicentreNeighborood(epicentre, height, primitivesArray);
    }
    var primitiveEpicentre = new Cesium.Primitive({
        geometryInstances : primitivesArray,
        appearance : new Cesium.PerInstanceColorAppearance({translucent: true}),
        releaseGeometryInstances: false
    });

    // primitiveNeighborood = new Cesium.Primitive({
    //     geometryInstances : neighborArray,
    //     appearance : new Cesium.PerInstanceColorAppearance(),
    //     releaseGeometryInstances: false
    // });
    // console.log(primitivesArray);
    scene.primitives.add(primitiveEpicentre);
    // scene.primitives.add(primitiveNeighborood);

    // primitive.readyPromise.then(function (primitive) {
    //     var attributes = primitive.getGeometryInstanceAttributes(earthquake);
    //     attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom({alpha: 1.0}));
    // });
    // console.log(data);
}


function drawEpicentreNeighborood(epicentre, height, neighborArray) {
    var limit = setLimitByMagnitude(Math.floor(epicentre.id.magnitude.magnitude));
    var starting_point_x = limit * unit;
    var starting_point_y = limit * unit;
    var starting_point_z = limit * unit;
    if(limit == 0){
        return [];
    }
    for(var i = starting_point_x; i > -starting_point_x - unit; i-=unit){
        var neighbor = new Cesium.GeometryInstance({
            geometry: geometryElevation,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(epicentre.id.origin.longitude, epicentre.id.origin.latitude)),
                new Cesium.Cartesian3(-i, 0, height + maxDepth), new Cesium.Matrix4()),
            id: epicentre.id,
            attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, epicentre.id), interpolateColorByMagnitude(1, epicentre.id), interpolateColorByMagnitude(2, epicentre.id), 0.5)
            }
        });
        neighborArray.push(neighbor);
        for(var j = starting_point_y; j > -starting_point_y - unit; j-=unit){
            var neighbor = new Cesium.GeometryInstance({
                geometry: geometryElevation,
                modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                    Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(epicentre.id.origin.longitude, epicentre.id.origin.latitude)),
                    new Cesium.Cartesian3(-i, -j, height + maxDepth), new Cesium.Matrix4()),
                id: epicentre.id,
                attributes: {
                    color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, epicentre.id), interpolateColorByMagnitude(1, epicentre.id), interpolateColorByMagnitude(2, epicentre.id), 0.5)
                }
            });
            neighborArray.push(neighbor);
            for(var z = starting_point_z; z > -starting_point_z - unit; z-=unit){
                var neighbor = new Cesium.GeometryInstance({
                    geometry: geometryElevation,
                    modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                        Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(epicentre.id.origin.longitude, epicentre.id.origin.latitude)),
                        new Cesium.Cartesian3(-i,  -j, -z + height + maxDepth), new Cesium.Matrix4()),
                    id: epicentre.id,
                    attributes: {
                        color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, epicentre.id), interpolateColorByMagnitude(1, epicentre.id), interpolateColorByMagnitude(2, epicentre.id), 0.5)
                    }
                });
                neighborArray.push(neighbor);
            }
        }
    }
    // scene.primitives.add(new Cesium.Primitive({
    //     geometryInstances : neighborArray,
    //     appearance : new Cesium.PerInstanceColorAppearance()
    // }));
    // console.log(neighborArray);

    // neighborArray = [];
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
                viewer2.selectedEntity = new Cesium.Entity({
                    id:  epicentre.id + "      " + epicentre.magnitude.magnitude,
                    // description: getEarthquakeInfos(stationMagnitudes, epicentre)
                    description: formatDateForList(earthquakeDate)
                });

                var pointHeight = pickedObject.id.origin.depth + maxDepth;
                cameraHeight -= (cameraHeight/zoomFactor);
                if(cameraHeight < pointHeight + 100){
                    cameraHeight = pointHeight + 100;
                }

                moveCameraTo(epicentre.origin, cameraHeight);

                getStationMagnitudes(stationMagnitudes, epicentre);
                // requestStations();
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

function getEarthquakeInfos(stationMagnitudes, epicentre){
    var infoBox = "<div class = wrap>"
            + "<div class=cesium-infoBox-description>"
                + "<div class=btn-group role=group aria-label=...>"
                    + "<button type=button class=btn btn-default id=animate-stations>Animate Stations</button>"
                    + "<button type=button class=btn btn-default>Simulate Propagation</button>"
                +"</div>"
            + "</div>"
           + "</div>";
    return infoBox;
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




function appearStations() {
    var primitivesArray = [];
    if(stationMagnitudes.length > 0) {
        var earthquake = stationMagnitudes.shift();

        var height = convertHeight(earthquake.station.elevation);
        var stationMagnitude = new Cesium.GeometryInstance({
            geometry: geometryStation,
            modelMatrix: Cesium.Matrix4.multiplyByTranslation(
                Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(earthquake.station.longitude, earthquake.station.latitude)),
                new Cesium.Cartesian3(0.0, 0.0, height + maxDepth), new Cesium.Matrix4()),
            id: earthquake,
            attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(interpolateColorByMagnitude(0, earthquake), interpolateColorByMagnitude(1, earthquake), interpolateColorByMagnitude(2, earthquake), 0.1)
            }
        });
        primitivesArray.push(stationMagnitude);

        var primitive = new Cesium.Primitive({
            geometryInstances: primitivesArray,
            appearance: new Cesium.PerInstanceColorAppearance({translucent: true})
        });

        scene.primitives.add(primitive);
    }
}


function haversine(lat1, lon1, lat2, lon2){
    var R = 6371 *(Math.pow(10,3)); // metres
    var toRadians = (Math.PI/180);
    var φ1 = lat1 * toRadians;
    var φ2 = lat2 * toRadians;
    var Δφ = (φ2-φ1) * toRadians;
    var Δλ = (lon2-lon1) * toRadians;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}


function requestStations(){
    $.ajax({
        url: "http://" + window.location.host + "/api/stations/query",
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            stations = data;
            drawStation(data);
        }
    })
}

function drawStation(data){
    for(var i = 0; i < data.length; ++i){
        getPrimitiveById(data[i], computeNearestRegion(data[i].latitude));
    }
}