var geometryElevation = new Cesium.BoxGeometry.fromDimensions({
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

function drawStation(data){
    for(var i = 0; i < data.length; ++i){
        getPrimitiveById(data[i], computeNearestRegion(data[i].latitude));
    }
}

function getPrimitiveForStation(station, region) {
    var selectedAttribute;
    var ids = [];
    var minId;
    for (var i = region - 5; i < region + 5; ++i) {
        if(scene.primitives.get(i).geometryInstances) {
            ids.push(computeNearestElevation(station.station, scene.primitives.get(i).geometryInstances));
        }
    }
    minId = computeNearestElevation(station.station, ids);
    for (var i = region - 5; i < region + 5; ++i) {
        if(scene.primitives.get(i)) {
            var attribute = scene.primitives.get(i).getGeometryInstanceAttributes(minId.id);
            if (attribute != undefined) {
                attributes.push(attribute);
                oldColors.push(attribute.color);
                attribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(interpolateColorByMagnitude(0, station), interpolateColorByMagnitude(1, station), interpolateColorByMagnitude(2, station), 0.5));
            }
        }
    }
    var stationNeigh = [filterArray(minId.id.id - 1), filterArray(minId.id.id - 1024 - 1), filterArray(minId.id.id - 1024), filterArray(minId.id.id - 1024 + 1), filterArray(minId.id.id + 1), filterArray(minId.id.id + 1024 + 1), filterArray(minId.id.id + 1024), filterArray(minId.id.id + 1024 - 1)]
    for(var j = 0; j < stationNeigh.length; j++) {
        if(stationNeigh[j]) {
            region = computeNearestRegion(stationNeigh[j].latitude)
            for (var i = region - 5; i < region + 5; ++i) {
                var newAttr = scene.primitives.get(i).getGeometryInstanceAttributes(stationNeigh[j]);
                if (newAttr != undefined) {
                    neighAttr.push(newAttr);
                    oldNeighCol.push(newAttr.color);
                    newAttr.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(interpolateColorByMagnitude(0, station), interpolateColorByMagnitude(1, station), interpolateColorByMagnitude(2, station), 0.5));
                }
            }

        }
    }
    return selectedAttribute;
}
