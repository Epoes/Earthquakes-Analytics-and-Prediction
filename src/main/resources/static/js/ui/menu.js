/* BAR-MENU */
const shortestDateFormat = "h:mm a, MMM Do YYYY";
const shortDateFormat = "h a, MMM Do YYYY";
const mediumDateFormat = "MMM Do YYYY";
const longDateFormat = "MMM YYYY";
const smallTimeFormat = "mm:ss";
let dateFormat = mediumDateFormat;


function setUpMenu(){
    setUpMagnitudeSlider();
    setUpPointsCoordinates();
    setUpDepthSlider();
    setUpDataRange();
}

$('#depth-slider').on('slideStop', function (slideEvt) {
    updateDepthRequest((slideEvt.value[0] * 1000), (slideEvt.value[1] * 1000))
});

$('#magnitude-slider').on('slideStop', function (slideEvt) {
    updateMagnitudeRequest(slideEvt.value[0], slideEvt.value[1])
});

$( "#home" ).click(function() {
    viewer.camera.flyHome(3);
});

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

$(".bar-menu-close").click(function() {
    closeBarMenu();
});

$("#color-selector").on("change",function(e) {
    selectColor();
});

$("#view-selector").on("change",function(e) {
    setPointsView();
    updatePointsPosition();
});

$("#resolution-selector option[value='1']").attr("selected",true);

$("#resolution-selector").on("change", function(){
    var numb = Number($("#resolution-selector option:selected").val());
    changeResolution(numb);
});

$("#frames-selector").on("change", function(){
    var numb = Number($("#frames-selector option:selected").val());
    changeFPS(numb);
});

$("#time-view-selector").on("change", function () {
    var view = $("#time-view-selector option:selected").text();
    var value =  $("#time-view-selector option:selected").val();
    settings.footerIndex = value;
    changeView(view);
});

$("#search-button").click(function() {
    $("#search-button").prepend("<i id = 'loading-icon' class='fa fa-spinner fa-spin'></i>");
    $("#search-button").prop("disabled",true);

    // $this.button('reset');
    searchEarthquakes(nextRequest, function(){
        $("#loading-icon").remove();
        $("#search-button").prop("disabled",false);
    })
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
                                  formatter : function(value){
                                      return value[0] + " : " + value[1] + " km";
                                  },
                              });

}

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


function setUpPointsCoordinates() {
    $("#min-lat").val(stdRequest.minPoint.latitude );
    $("#min-lng").val(stdRequest.minPoint.longitude);
    $("#min-lat").before("<p>min point</p>");

    $("#max-lat").val(stdRequest.maxPoint.latitude );
    $("#max-lng").val(stdRequest.maxPoint.longitude);
    $("#max-lat").before("<p>max point</p>");
}

function closeBarMenu(){
    $(".nav-bar").css("background-color", "");
    // $(".bar-menu").css("background-color", 'rgba(48, 51, 54,0.5)');
    $(".bar-menu").css("left", '');
    $(".open-nav").css("background-color", "");
}

function selectColor() {
    let colorOption = $("#color-selector option:selected").text();
    selectedColorIndex =  $("#color-selector option:selected").val();
    changeColorOption(colorOption);
}


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