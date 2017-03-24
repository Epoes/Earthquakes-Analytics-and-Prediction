var map = L.map(document.getElementById('map')).setView([43.097003, 12.390278], 5);
var italyLayer = L.geoJson(italyNeighbors).addTo(map);
map.fitBounds(italyLayer.getBounds());
// var circle = L.circle([43.097003, 12.390278], {radius: 20000, color: "#FF0000", stroke: false}).addTo(map);
$(document).ready(function () {
    $.ajax({
        url: "http://localhost:8080/api/earthquakes/last-update",
        type: "GET",
        success: function (data, textStatus, jqXHR) {
         drawEarthquakes(data);
        }
    });
});

function drawEarthquakes(earthquakes) {
    for(var i = 0; i < earthquakes.length; ++i){
        var latitude = earthquakes[i].origin.latitude;
        var longitude = earthquakes[i].origin.longitude;
        var magnitude = earthquakes[i].magnitude.magnitude;
        var circle = L.circle([latitude, longitude], {radius: adjustRadius(magnitude), color: adjustColor(magnitude), stroke: false}).addTo(map);
        var center = L.circle([latitude, longitude], {radius: adjustRadius(magnitude)/1000, color: adjustColor(magnitude)}).addTo(map);
        var popup = L.popup()
            .setLatLng([latitude, longitude])
            .setContent("<b>Magnitude: </b>" + magnitude + "<br> <b>Zone: </b>" + earthquakes[i].regionName + "<br><b>Date: </b>" + dateFormatter(earthquakes[i].origin.time))
            .openOn(map);
        circle.bindPopup(popup).openPopup(center);
    }
}

