var map = L.map(document.getElementById('map')).setView([43.097003, 12.390278], 5);
var italyLayer = L.geoJson(italyNeighbors).addTo(map);
map.fitBounds(italyLayer.getBounds());
var popup = L.popup()
    .setLatLng([45.506154, 10.940564])
    .setContent('<p>SIAMO NEGRI NOI!<br />E Marco Muto.</p>')
    .openOn(map);
var circle = L.circle([43.097003, 12.390278], {radius: 20000, color: "#FF0000", stroke: false}).addTo(map);