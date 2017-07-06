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
let nextDistance = 0;
var currentTime = 0;
var startTime = 0;
var attributes = [];
var oldColors = [];
var neighAttr = [];
var oldNeighCol = [];
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

var unit = 911.3862583;
var unitFake = 1000.4257813;
var maxDepth = 35000;
var cyan = [0.529412, 0.807843, 0.980392];
var deep_blue = [0.0, 0.0, 0.501961];
var ground_green = [0.133333, 0.545098, 0.133333];
var brown_light = [0.721569, 0.52549, 0.0431373];
var brown = [0.2862745098, 0.1725490196, 0.05098039216];
var ghost_white = [0.972549, 0.972549, 1];
var white = [1.0,1.0,1.0];
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

function checkNeighbor() {
    scene.primitives.get(scene.primitives.length - 1).show = false;
    if(nextStation < stationMagnitudes.length) {
    // if(nextStation < 1) {
            fillInfoBox(stationMagnitudes[nextStation]);
            getPrimitiveForStation(stationMagnitudes[nextStation], computeNearestRegion(stationMagnitudes[nextStation].station.latitude));
            nextStation++
        } else {
            scene.primitives.get(scene.primitives.length - 1).show = true;
            $("#info-earthquake").css('visibility', 'visible');
            $("#info-station").css('visibility', "hidden");
            $("#animate-stations").css('visibility', 'visible');
            $("#propagate-epicentre").css('visibility', 'visible');
            clearInterval(neighInterval);
        }
}

function fillInfoBox(stationMagnitude){
    $("#info-earthquake").css('visibility', 'hidden');
    $("#info-station").css('visibility', "visible");
    $("#animate-stations").css('visibility', 'hidden');
    $("#propagate-epicentre").css('visibility', 'hidden');
    $("#station-name").text(stationMagnitude.station.name);
    $("#station-magnitude").text(stationMagnitude.magnitude);
    $("#type-station-magn").text(stationMagnitude.type);
    $("#arrival-time").text(formatDateForList(new Date(stationMagnitude.amplitude.time)));
    $("#elevation").text(stationMagnitude.station.elevation);
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
    scene.primitives.get(scene.primitives.length - 1).show = false;
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
        //     scene.primitives.get(scene.primitives.length - 1).show = true;
        // }
        nextStation++;
    // } else {
    //     scene.primitives.get(scene.primitives.length - 1).show = true;
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
        scene.primitives.get(scene.primitives.length - 1).show = true;
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
    return neighborArray;
}
