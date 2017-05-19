//TODO: move to index.html
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
                        + "</div>"
);

$(document.body).append("<div class= 'player' id = 'player' >"
                            + "<div id = 'play-container' >"
                                + "<button  class='btn btn-default' id='play-button'> <i class='fa fa-play' aria-hidden='true'></i></i></button>"
                                + "<button  class='btn btn-default' id='pause-button'> <i class='fa fa-pause' aria-hidden='true' ></i></button>"
                            + "</div>"
                            + "<div id = 'stop-container' >"
                                + "<button  class='btn btn-default' id='stop-button'> <i class='fa fa-stop' aria-hidden='true'></i></button>"
                            + "</div>"
                            + "<div id = 'info-container' >"
                                + "<p id = 'max-time'>/0</p><p id = 'current-time'>0</p>"
                                + "<p id = 'time'>0</p><p id = 'total-time'>/0</p>"
                                + "<div id = 'speed-control'>"
                                    + "<i id = 'speed-plus' class='fa fa-arrow-up' aria-hidden='true'></i>"
                                    // + "<i id = 'speed-down' class='fa fa-arrow-down' aria-hidden='true'></i>"

                                + "</div>"
                                + "</div>"

                            + "<input class = 'option-slider' id='time-slider' type='text' />"
                        + "</div>"
);

$(document.body).append("<div class = 'legend-container' >"
                            + "<div class = 'color-container'> "
                                + "<div class = 'color' id = 'color1'> </div>"
                            + "</div>"
                        + "</div>");

for(var i = 0; i < 7; i++){
    $("#color1").append("<p class='leggend-text' ></p>");
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
            +"<p class = 'settings-title'>time view</p>"
            + "<div class='menu-switch-box ' id = 'time-view-selector'>"
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

    setUpMagnitudeSlider();

    setUpPointsCoordinates();

    setUpDepthSlider();

    setUpDataRange();

});


var shortestDateFormat = "h:mm a, MMM Do YYYY";
var shortDateFormat = "h a, MMM Do YYYY";
var mediumDateFormat = "MMM Do YYYY";
var longDateFormat = "MMM YYYY";

var dateFormat = mediumDateFormat;
var smallTimeFormat = "mm:ss";

$("#pause-button").hide();
$("#play-container").click(function(e){
    if(!play){
        playTimeLine();
    }else{
        pauseTimeLine();
    }
});



$("#stop-container").click(function(e){
    resetTimeLaps();
});

$("#speed-plus").click(function(e){
    changeTotalTime()
});

var timeSlider;
function setupPlayer(minDate, maxDate, totalTime, daysPerSeconds){
    timeSlider = $("#time-slider").slider({
                                              id : "slider3",
                                              min : minDate,
                                              max : maxDate,
                                              selection : "before",
                                              value : minDate,
                                              formatter : function(value){
                                                  return moment(value).format(dateFormat);
                                              }
                                          });
    setMaxMinDate(minDate, maxDate, daysPerSeconds);
    setTotalTimeText(totalTime);
    $("#time").text(moment(0).format(smallTimeFormat) + " / ")
}

function setMaxMinDate(minDate, maxDate, daysPerSeconds){
    if(daysPerSeconds > 30){
        dateFormat = longDateFormat;
    } else if(daysPerSeconds > 0.45){
        dateFormat = mediumDateFormat;
    }else if (daysPerSeconds > 0.1){
        dateFormat = shortDateFormat;
    }else{
        dateFormat = shortestDateFormat;
    }
    $("#current-time").text(moment(minDate).format(dateFormat));
    $("#max-time").text(" / " +moment(maxDate).format(mediumDateFormat));
}


function setTotalTimeText(time){
    $("#total-time").text(moment(time).format(smallTimeFormat));
}

function setTimeSliderValue(date, time){
    timeSlider.slider('setValue', date);
    $("#current-time").text(moment(date).format(dateFormat));
    $("#time").text(moment(time).format(smallTimeFormat) + " / ")
}
$('#time-slider').on('slideStart', function (slideEvt) {
    pauseTimeLine();
});

$('#time-slider').on('slide', function (slideEvt) {
    $("#current-time").text(moment(slideEvt.value).format(dateFormat));
});

$('#time-slider').on('slideStop', function (slideEvt) {
    pauseTimeLine();
    changeCurrentTime(slideEvt.value);
    playTimeLine();
});






function setUpDataRange(){
    $(function() {

        var start = moment().subtract(100, 'days');
        var end = moment();

    function cb(start, end) {
            $('#reportrange span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
            nextRequest.startTime = start.toDate();
            nextRequest.endTime = end.toDate();
        }

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
}


function setUpMagnitudeSlider(){
    $('#magnitude-slider').slider({
      id: "slider1",
      min: 0,
      max: 10,
      range: true,
      value: [(stdRequest.minMag), (stdRequest.maxMag)]
    });
}

function setUpDepthSlider(){
    $('#depth-slider').slider({
      id: "slider2",
      min: 0,
      max: 650,
      range: true,
      value: [(stdRequest.minDepth / 1000),
              (stdRequest.maxDepth / 1000)],
      scale: 'logarithmic',
  });

}

function setUpPointsCoordinates() {
    $("#min-lat").val(stdRequest.minPoint.latitude );
    $("#min-lng").val(stdRequest.minPoint.longitude);
    $("#min-lat").before("<p>min point</p>");

    $("#max-lat").val(stdRequest.maxPoint.latitude );
    $("#max-lng").val(stdRequest.maxPoint.longitude);
    $("#max-lat").before("<p>max point</p>");
}


/* DEFINE INPUT ACTION */

var timeLineMode = false;
$("#time-view-selector").on("change", function (e) {
    var timeView = $("#time-view-selector option:selected").text();

    if(timeView === "on"){
        setUpTimeLineView();
        timeLineMode = true;
        closeBarMenu();
    }else {
        clearTimeLaps();
        timeLineMode = false;
    }
});

$('#depth-slider').on('slideStop', function (slideEvt) {
    updateDepthRequest((slideEvt.value[0] * 1000), (slideEvt.value[1] * 1000))
});

$('#magnitude-slider').on('slideStop', function (slideEvt) {
    updateMagnitudeRequest(slideEvt.value[0], slideEvt.value[1])
});

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
    closeBarMenu();
});

function closeBarMenu(){
    $(".nav-bar").css("background-color", "");
    // $(".bar-menu").css("background-color", 'rgba(48, 51, 54,0.5)');
    $(".bar-menu").css("left", '');
    $(".open-nav").css("background-color", "");
}
//color selector
$("#color-selector").on("change",function(e) {
    var colorOption = $("#color-selector option:selected").text();
    var isChange = true;

    if(colorOption === "magnitude"){
        selectedColorInterpolation = interpolateColorByMagnitude;
        setCaption = setCaptionByMagnitude;

    }else if (colorOption === "date"){
        selectedColorInterpolation = interpolateColorByTime;
        setCaption = setCaptionByDate;
    }else{
        selectedColorInterpolation = interpolateColorByDepth;
        setCaption = setCaptionByDepth;
    }

    updatePointsColor();
});

$("#view-selector").on("change",function(e) {
    setPointsView();
    updatePointsPosition();
});

function setPointsView(){
    var viewMode = $("#view-selector option:selected").text();
    if (viewMode === "on") {
        changeOnClickHandler("3dMode");
        changePositionMode("3dMode");
    } else {
        changeOnClickHandler("2dMode")
        changePositionMode("2dMode");
    }
}

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



/*options functions */

function updateMagnitudeRequest(min, max){
    nextRequest.minMag = min;
    nextRequest.maxMag = max;
}

function updateDepthRequest(min, max){
    nextRequest.minDepth = min;
    nextRequest.maxDepth = max;
}

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


/* infoBox */

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