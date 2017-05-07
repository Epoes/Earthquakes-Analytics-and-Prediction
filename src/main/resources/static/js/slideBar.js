


$(document.body).append("<div class='nav-bar'> "
                        + "<div class='bar-item' id = 'home' > <i class='fa fa-home big-icon' aria-hidden='true'></i> </div>"

                        + "<div class='bar-item open-nav open-button' > <i class='fa fa-search big-icon open-button' aria-hidden='true'></i> "
                            + "<div class = 'bar-menu' id = 'search-menu'> "
                                +"<i class='fa fa-times bar-menu-close' aria-hidden='true'></i>"
                                + "<h3 class = bar-menu-title>Search</h3>"
                                + "<div class = menu-body>"

                                    + "<div class = search-container >"
                                        + "<p> Date Range </p>"
                                        + "<div id='reportrange' class='pull-left' > <i class='glyphicon glyphicon-calendar fa fa-calendar'></i>&nbsp;<span></span> <b class='caret'></b> </div>"
                                    +"</div>"

                                    + "<div class = search-container >"
                                        + "<p> Magnitude </p>"
                                        + "<input class = 'option-slider' id='magnitude-slider' type='text' />"
                                    +"</div>"

                                    + "<div class = search-container > "
                                        + "<p> Depth </p>"
                                        + "<input id='depth-slider' class = 'option-slider' type='text' />"
                                    +"</div>"

                                    + "<div class = search-container style = 'height: 169px;'> <p style='margin-bottom: 20px;'> Coordinates <button type='button' class='btn btn-default' id = 'default-points-button'>Reset</button></p>"
                                        + getCoordinateHTML()

                                    + "<button type='button' class='btn btn-default' id = 'search-button'> search</button>"
                                + "</div>"
                                + "</div>"
                            + "</div>"

                        + "<div class='bar-item open-nav open-button'> <i class='fa fa-cog big-icon open-button' aria-hidden='true'></i> "
                            + "<div class = 'bar-menu' id = 'settings-menu'> "
                            +"<i class='fa fa-times bar-menu-close' aria-hidden='true'></i>"
                                + "<h3 class = bar-menu-title>Settings</h3>"
                               + getSettingsMenuTable()
                                + "</div>"
                            + "</div>"
                        + "</div>"

                        + "<div class='bar-item open-nav open-button'> <i class='fa fa-bar-chart big-icon open-button' aria-hidden='true'></i> "
                            + "<div class = 'bar-menu' id = 'chart-menu'> "
                                +"<i class='fa fa-times bar-menu-close' aria-hidden='true'></i>"
                                + "<h3 class = bar-menu-title>Charts</h3>"
                                + "<div class = menu-body>"

                                + "</div>"
                            + "</div>"
                        + "</div>"

                        + "<div class='bar-item open-nav open-button'> <i class='fa fa-info big-icon open-button' aria-hidden='true'></i> "
                            + "<div class = 'bar-menu' id = 'info-menu'> "
                                +"<i class='fa fa-times bar-menu-close' aria-hidden='true'></i>"
                                + "<h3 class = bar-menu-title>Info</h3>"
                                + "<div class = menu-body id = 'info-menu-body'></div>"
                        + "</div>"
                        + "</div>");

$(document.body).append("<div id = 'slider-container'>"
                        + "<div id='time-slider'></div>"
                        + "</div>");



function getCoordinateHTML(){
    return ("<div class = 'coordinates-container'>"
    +  "<input type='text' class='form-control coordinate-input'  id = 'min-lat' placeholder='lat' >"
    +  "<input type='text' class='form-control coordinate-input'  id='min-lng' placeholder='lng'> "
    + "</div>"

    + "<div class = 'coordinates-container'>"
    +  "<input type='text' class='form-control coordinate-input'  id = 'max-lat' placeholder='lat' >"
    +  "<input type='text' class='form-control coordinate-input'  id='max-lng' placeholder='lng'> "
    + "</div>"
    + "</div>");
}

$(document).ready(function () {

    /*
     MAGNITUDE search options
     */

    setUpMagnitudeSlider();

    $('#magnitude-slider').on('slideStop', function (slideEvt) {
        updateMagnitudeRequest(slideEvt.value[0], slideEvt.value[1])
    });





    $('#depth-slider').slider({
                                  id: "slider2",
                                  min: 0,
                                  max: 650,
                                  range: true,
                                  value: [(stdRequest.minDepth / 1000),
                                          (stdRequest.maxDepth / 1000)],
                                  scale: 'logarithmic',
                              })

    $('#depth-slider').on('slideStop', function (slideEvt) {
                              updateDepthRequest((slideEvt.value[0] * 1000), (slideEvt.value[1] * 1000))
                          }
    );

    $(function() {

        var start = moment().subtract(100, 'days');
        var end = moment();

        function cb(start, end) {
            $('#reportrange span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
            nextRequest.startTime = start.toDate();
            nextRequest.endTime = end.toDate();
        }

        writeCoordinates();

        $('#reportrange').daterangepicker({
                                              startDate: start,
                                              endDate: end,
                                              ranges: {
                                                  'Today': [moment(), moment()],
                                                  'Last 2 days': [moment().subtract(1, 'days'), moment()],
                                                  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                                  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                                  'Last Year': [moment().subtract(1, 'year'), moment()],
                                                  "All" : [moment("1985/01/01",  "YYYY-MM-DD"), moment()]
                                              },
                                              linkedCalendars : false,
                                              showDropdowns: true,
                                              autoApply : true,
                                              minDate: moment("1985/01/01", "YYYY-MM-DD"),
                                              maxDate: moment(),

                                          }, cb);

        cb(start, end);

    });

});


function setUpMagnitudeSlider(){
    $('#magnitude-slider').slider({
      id: "slider1",
      min: 0,
      max: 10,
      range: true,
      value: [(stdRequest.minMag), (stdRequest.maxMag)]
    });

}

function updateMagnitudeRequest(min, max){
    nextRequest.minMag = min;
    nextRequest.maxMag = max;
}

function writeCoordinates() {
    $("#min-lat").val(stdRequest.minPoint.latitude );
    $("#min-lng").val(stdRequest.minPoint.longitude);
    $("#min-lat").before("<p>min point</p>");

    $("#max-lat").val(stdRequest.maxPoint.latitude );
    $("#max-lng").val(stdRequest.maxPoint.longitude);
    $("#max-lat").before("<p>max point</p>");
}




function updateDepthRequest(min, max){
    nextRequest.minDepth = min;
    nextRequest.maxDepth = max;
}




function getSettingsMenuTable(){
    return  "<div class = menu-body>"
                +"<div class = settings-container >"
                    +"<p class ='settings-title'>color by</p>"
                        + "<div class='menu-select-box' id = 'color-selector'>"
                            + "<select class = 'menu-selector selectpicker'  data-width='auto' >"
                                +" <option>magnitude</option>"
                                + "<option>date</option>"
                                + "<option>depth</option>"
                            + "</select>"
                        + "</div>"
                +"</div>"

                +"<div class = settings-container >"
                +"<p class = 'settings-title'>3d view</p>"
                    + "<div class='menu-switch-box ' id = 'view-selector'>"
                        + "<select class = 'menu-selector selectpicker' data-width='auto'>"
                            +"<option>off</option>"
                            + "<option>on</option>"
                        + "</select>"
                    + "</div>"
                +"</div>"
                +"<div class = settings-container >"
                    +"<p class ='settings-title'>Resolution</p>"
                    + "<div class='menu-select-box' id = 'resolution-selector'>"
                    + "<select class = 'menu-selector selectpicker'  data-width='auto' >"
                        +" <option value = '2' >very high</option>"
                        + "<option value = '1.5' >high</option>"
                        + "<option value = '1' >medium</option>"
                        + "<option value = '0.7' >low</option>"
                        + "<option value = '0.5' >very low</option>"
                    + "</select>"
                    + "</div>"
                +"</div>"
                +"<div class = settings-container >"
                    +"<p class ='settings-title'>FPS</p>"
                    + "<div class='menu-select-box' id = 'frames-selector'>"
                    + "<select class = 'menu-selector selectpicker'  data-width='auto' >"
                        +" <option value = '60' >60 fps</option>"
                        + "<option value = '30' >30 fps</option>"
                        + "<option value = '25' >25 fps</option>"
                    + "</select>"
                    + "</div>"
                +"</div>"
}

$( "#home" ).click(function() {
    var camera = viewer.camera;
    camera.flyHome(3);
});


//open menu-bar
$( ".open-nav" ).click(function(e) {
    if($(e.target).hasClass("open-button")) {
        $(".bar-item").css("background-color", '');
        $(".nav-bar").css("background-color", "rgba(48, 51, 54, 1)");
        var clicked = $(this);
        clicked.css("background-color", "#282828");
        $(".bar-menu").css("left", "-400px");
        clicked.find(".bar-menu").css("left", "90px");
    }
});

//close menu-bar
$(".bar-menu-close").click(function() {
    $(".nav-bar").css("background-color", "");
    $(".bar-menu").css("left", '');
    $(".open-nav").css("background-color", "");
});

//color selector
$("#color-selector").on("change",function(e) {
    var colorOption = $("#color-selector option:selected").text();
    var isChange = true;

    if(colorOption === "magnitude"){
        selectedColorInterpolation = interpolateColorByMagnitude;

    }else if (colorOption === "date"){
        selectedColorInterpolation = interpolateColorByTime;
    }else{
        selectedColorInterpolation = interpolateColorByDepth;
    }

    updatePointsColor();
});

$("#view-selector").on("change",function(e) {
    var colorOption = $("#view-selector option:selected").text();

    if(colorOption === "on"){
        getCartesianPosition = get3dPosition;
        doubleClickHandler = doubleClickHandler3d;

    }else {
        getCartesianPosition = get2dPosition;
        doubleClickHandler = doubleClickHandler2d;
    }

    updatePointsPosition();
});

$("#resolution-selector").on("change", function(){
    var numb = Number($("#resolution-selector option:selected").val());
    changeResolution(numb);
});

$("#resolution-selector option[value='1']").attr("selected",true);

$("#frames-selector").on("change", function(){
    var numb = Number($("#frames-selector option:selected").val());
    changeFPS(numb);
});




$("#search-button").click(function() {
    $("#search-button").prepend("<i id = 'loading-icon' class='fa fa-spinner fa-spin'></i>");
    $("#search-button").prop("disabled",true);

        // $this.button('reset');
    setTimeout(doMultiRequest(nextRequest, function () {
        $("#loading-icon").remove();
        $("#search-button").prop("disabled",false);
    }), 0 );
});

$("#min-lat").change(function(){
    if(isANumb($(this).val())){
        nextRequest.minPoint.latitude = Number($(this).val());
    }else{
        $(this).val(nextRequest.minPoint.latitude);
    }

});

$("#min-lng").change(function(){
    if(isANumb($(this).val())){
        nextRequest.minPoint.longitude = Number($(this).val());
    }else{
        $(this).val(nextRequest.minPoint.longitude);
    }
});

$("#max-lat").change(function(){
    if(isANumb($(this).val())){
        nextRequest.maxPoint.latitude = Number($(this).val());
    }else{
        $(this).val(nextRequest.maxPoint.latitude);
    }

});

$("#max-lng").change(function(){
    if(isANumb($(this).val())){
        nextRequest.maxPoint.longitude = Number($(this).val());
    }else{
        $(this).val(nextRequest.maxPoint.longitude);
    }
});


$("#default-points-button").click(function(){
    resetCoordinates();
});



function resetCoordinates(){
    nextRequest.minPoint.latitude = Number(35);
    nextRequest.minPoint.longitude = Number(5);
    nextRequest.maxPoint.latitude = Number(49);
    nextRequest.maxPoint.longitude = Number(20);
    $("#min-lat").val(nextRequest.minPoint.latitude );
    $("#min-lng").val(nextRequest.minPoint.longitude);

    $("#max-lat").val(nextRequest.maxPoint.latitude );
    $("#max-lng").val(nextRequest.maxPoint.longitude);
}


//infoBox
function showInfoBox(earthquake){
    viewer.selectedEntity = new Cesium.Entity({
                                  id: earthquake.id,
                                  description: getInfoBoxDescription(earthquake)
                              });
}

function closeInfoBox(){
    viewer.selectedEntity = undefined;
}


function getInfoBoxDescription(e){
    return "<div class = wrap>"
                + "<div class=cesium-infoBox-description>"
                    +"<table class=cesium-infoBox-defaultTable>"
                    + "<tbody>"
                        // +"<tr>"
                        //     + "<th>region</th>"
                        //     + "<td>"+ e.regionName + "</td>"
                        // +"</tr>"
                        +"<tr>"
                            + "<th>magnitude</th>"
                            + "<td>"+ e.magnitude.magnitude + " " + e.magnitude.type + "</td>"
                        +"</tr>"
                        +"<tr>"
                            + "<th>date</th>"
                            + "<td>"+ formatDateForList(new Date(e.origin.time))  + "</td>"
                        +"</tr>"
                        + "<tr>"
                            + "<th>depth</th>"
                            + "<td>" + e.origin.depth + " m" + "</td>"
                        + "</tr>"

                        + "<tr>"
                            + "<th>intensity</th>"
                            + "<td>" + getTheoreticalIntensity(e.magnitude.magnitude) + "</td>"
                        + "</tr>"
                    + "</tbody>"
                    +"</table>"
                + "</div>"
           + "</div>"
}

function getTheoreticalIntensity(magnitude){
    if (magnitude < 2.4){
        return "I";
    }else if(magnitude < 2.8){
        return "II";
    }else if(magnitude < 3.2){
        return "III";
    }else if(magnitude < 2.7){
        return "IV";
    }else if(magnitude < 4.2){
        return "V";
    }else if(magnitude < 4.7){
        return "VI";
    }else if(magnitude < 5.2){
        return "VII";
    }else if(magnitude < 5.6){
        return "VIII";
    }

    return "IX";

}