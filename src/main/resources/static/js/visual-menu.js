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


$("#magnitude-filter").bootstrapSlider({});

$("#magnitude-filter").on('slideStop', function (slideEvt) {
    updateMagnitudeRequest(slideEvt.value[0], slideEvt.value[1])
});

$(function() {
    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        stdRequest.startTime = start.toDate();
        stdRequest.endTime = end.toDate();
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'All with stations': [moment("2006/01/01",  "YYYY-MM-DD"), moment()],
            'All': [moment("1985/01/01",  "YYYY-MM-DD"), moment()]
        },
        minDate: moment("1985/01/01", "YYYY-MM-DD"),
        maxDate: moment()
    }, cb);

    cb(start, end);
});

$("#reportrange").click(function(){
    $("nav.sidebar").addClass("hover")
});

$("#cesiumContainer").click(function(){
    $("nav.sidebar").removeClass("hover")
});

$("#query-btn").click(function () {
    doRequest(stdRequest);
});
function updateMagnitudeRequest(min, max){
    stdRequest.minMag = min;
    stdRequest.maxMag = max;
}

