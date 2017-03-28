
var map = L.map(document.getElementById('map')).setView([43.097003, 12.390278], 5);
var italyLayer = L.geoJson(italyNeighbors).addTo(map);
map.fitBounds(italyLayer.getBounds());

var markers = new L.FeatureGroup();

$("#query-button").click(function () {
    markers.clearLayers();
    var magnitude = document.getElementById("magnitude-field").value;
    var count = document.getElementById("count-field").value;
    $.ajax({
        url: "http://localhost:8080/api/earthquakes/last-update/" + validateCount(count) + "/" + validateMagnitude(magnitude),
        type: "GET",
        success: function (data, textStatus, jqXHR) {
         //drawEarthquakes(data);
        }
    });
});

function validateMagnitude(magnitude){
    return magnitude ? magnitude : 2;
}

function validateCount(count){
    return count ? count : 100;
}

function drawEarthquakes(earthquakes) {
    for(var i = 0; i < earthquakes.length; ++i){
        var latitude = earthquakes[i].origin.latitude;
        var longitude = earthquakes[i].origin.longitude;
        var magnitude = earthquakes[i].magnitude.magnitude;
        var circle = (L.circle([latitude, longitude], {radius: adjustRadius(magnitude), color: adjustColor(magnitude), stroke: false}));
        var center = (L.circle([latitude, longitude], {radius: adjustRadius(magnitude)/1000, color: adjustColor(magnitude)}));
        var popup = L.popup()
            .setLatLng([latitude, longitude])
            .setContent("<b>Magnitude: </b>" + magnitude + "<br> <b>Zone: </b>" + earthquakes[i].regionName + "<br><b>Date: </b>" + dateFormatter(earthquakes[i].origin.time))
            .openOn(map);
        circle.bindPopup(popup).openPopup(center);
        markers.addLayer(circle);
        markers.addLayer(center);
    }
    map.addLayer(markers);
}

