var instances = [];
 var instance = new Cesium.GeometryInstance({
     geometry : new Cesium.CircleGeometry({
         center : Cesium.Cartesian3.fromDegrees(8.651733, 38.876451),
         radius : 300000.0,
         //granularity : 5 * Cesium.Math.RADIANS_PER_DEGREE,
         vertexFormat: Cesium.VertexFormat.POSITION_AND_COLOR
     }),
     attributes : {
         color : new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.8)
     }
 });
 instances.push(instance);



scene.primitives.add(new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance()
}));