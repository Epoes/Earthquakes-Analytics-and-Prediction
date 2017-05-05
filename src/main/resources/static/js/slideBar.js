//
//
// var startDate = new Date();
// //start time 100 days back
// startDate.setDate(startDate.getDate()-100);
//
//
//
// function setUpDateFilter(){
//     var slider = $( "#slider-range-date" )
//     slider.slider({
//                       range: true,
//                       min: new Date('1985-01-02').getTime() / 1000,
//                       max: new Date().getTime() / 1000,
//                       step: 86400,
//                       values: [  startDate.getTime() / 1000, new Date().getTime() / 1000 ],
//                       change: function (event, ui) {
//                           setUpMaxMinDate(new Date(ui.values[0]*1000), new Date(ui.values[1]*1000));
//                       },
//                       slide: function( event, ui ) {
//                           $( "#amount-date" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
//                       }
//                   });
//     $( "#amount-date" ).val( (new Date(slider.slider( "values", 0 )*1000).toDateString()) +
//                              " - " + (new Date(slider.slider( "values", 1 )*1000)).toDateString());
// }
//
//
//
//
// function setUpMaxMinDate(minTime, maxTime){
//     minTime.setHours(00, 00, 00);
//     maxTime.setHours(23, 59, 59);
//
//     start_time = formatDateForQuery(minTime);
//     end_time = formatDateForQuery(maxTime);
// }
//
//
// $('#query-button').click(function () {
//     doRequest();
//     cancelPin();
//     //$("#query-container").slideUp();
//     //$("#searchBtn").css("visibility", "visible");
// });
//
// $("#searchBtn").click(function () {
//     $("#query-container").slideDown();
//     $("#searchBtn").css("visibility", "hidden");
// })
//
// function setUpMagnitudeFilter(){
//     var slider = $( "#slider-range-magnitude" )
//     slider.slider({
//                       range: true,
//                       min: 0,
//                       max: 10,
//                       step: 0.5,
//                       values: [2, 10],
//                       change: function (event, ui) {
//                           setUpMagnitude(ui.values[0], ui.values[1]);
//                       },
//                       slide: function( event, ui ) {
//                           $( "#amount-magnitude" ).val("Magnitude between: " + ui.values[0] + " and " + ui.values[1]);
//                       }
//                   });
//     $( "#amount-magnitude" ).val( "Magnitude between: " + slider.slider( "values", 0 ) + " and " + slider.slider( "values", 1 ));
// }
//
//
//
//
// function setUpMagnitude(minMagn, maxMagn) {
//     minMag = minMagn;
//     maxMag = maxMagn;
// }
//
// $('.hamburger').click(function () {
//     openNav("Left");
// });
//
// $('#closebtnLeft').click(function () {
//     closeNav("Left");
// });
//
// $('#closebtnPart').click(function () {
//     closeNav("Part");
// });
// /* Set the width of the side navigation to 250px */
// function openNav(side) {
//     document.getElementById("mySidenav" + side).style.width = "280px";
// }
//
// /* Set the width of the side navigation to 0 */
// function closeNav(side) {
//     document.getElementById("mySidenav" + side).style.width = "0";
// }
//
// // Get the modal
// var modal = document.getElementById('myModal');
//
// // Get the button that opens the modal
// var btn = document.getElementById("info");
//
// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
//
// // When the user clicks on the button, open the modal
// btn.onclick = function() {
//     modal.style.display = "block";
//     document.getElementById("defaultOpen").click();
// }
//
// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }
//
// function openTab(evt, tabName) {
//     // Declare all variables
//     var i, tabcontent, tablinks;
//
//     // Get all elements with class="tabcontent" and hide them
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//         tabcontent[i].style.display = "none";
//     }
//
//     // Get all elements with class="tablinks" and remove the class "active"
//     tablinks = document.getElementsByClassName("tablinks");
//     for (i = 0; i < tablinks.length; i++) {
//         tablinks[i].className = tablinks[i].className.replace(" active", "");
//     }
//
//     // Show the current tab, and add an "active" class to the button that opened the tab
//     document.getElementById(tabName).style.display = "block";
//     evt.currentTarget.className += " active";
// }
//
// function displayInfo(earthquake) {
//     var date = new Date(earthquake.origin.time);
//     $('#earthquake-info').append("<ul id='list-info'></ul>");
//     $("#list-info").append("<li class='info-item'><a>Zone: " + earthquake.regionName +"</a></li>");
//     $("#list-info").append("<li class='info-item'><a>Magnitude: " + earthquake.magnitude.magnitude + " " + earthquake.magnitude.type + "</a></li>");
//     $("#list-info").append("<li class='info-item'><a>Depth: " + earthquake.origin.depth +" m</a></li>");
//     $("#list-info").append("<li class='info-item'><a>Date: " + formatDateForList(date) +"</a></li>");
//
// }
//
function formatDateForList(date){
    var year = date.getFullYear();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var month =  date.getMonth();
    var monthToString = monthNames[month]
    var day = date.getDate() + "";
    day = addZeroToString(day);
    var hours = date.getHours() + "";
    hours = addZeroToString(hours);
    var minutes = date.getMinutes() + "";
    minutes = addZeroToString(minutes);
    var seconds =date.getSeconds() + "";
    seconds = addZeroToString(seconds);

    return day + " " + monthToString + " " + year + " at " + hours + "h" +minutes + "m" + seconds + "s";
}


$(document.body).append("<div class='nav-bar'> "
                        + "<div class='bar-item' id = 'home' > <i class='fa fa-home big-icon' aria-hidden='true'></i> </div>"

                        + "<div class='bar-item open-nav open-button' > <i class='fa fa-search big-icon open-button' aria-hidden='true'></i> "
                            + "<div class = 'bar-menu' id = 'search-menu'> "
                                +"<i class='fa fa-times bar-menu-close' aria-hidden='true'></i>"
                                + "<h3 class = bar-menu-title>Search</h3>"
                                + "<div class = menu-body>"

                                    + "<div class = search-container ><p> date </p>"
                                        + "<div id='reportrange' class='pull-left' > <i class='glyphicon glyphicon-calendar fa fa-calendar'></i>&nbsp;<span></span> <b class='caret'></b> </div>"

                                    +"</div>"

                                    + "<div class = search-container > <p> magnitude </p>"
                                        + "<input id='magnitude-slider' type='text' />"
                                    +"</div>"

                                    + "<div class = search-container > <p> depth </p>"
                                        + "<input id='depth-slider' type='text' />"
                                    +"</div>"

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




//slider
$(document).ready(function () {
    $('#magnitude-slider').slider({
                                      id: "slider1",
                                      min: 0,
                                      max: 10,
                                      range: true,
                                      value: [(stdRequest.minMag), (stdRequest.maxMag)]
                                  })

    $('#magnitude-slider').on('slideStop', function (slideEvt) {

                                  updateMagnitudeRequest(slideEvt.value[0], slideEvt.value[1])
                              }
    );
    $('#depth-slider').slider({
                                  id: "slider2",
                                  min: 0,
                                  max: 600,
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
            console.log(nextRequest)
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

});

function updateDepthRequest(min, max){
    nextRequest.minDepth = min;
    nextRequest.maxDepth = max;
}

function updateMagnitudeRequest(min, max){
    nextRequest.minMag = min + 0.01;
    nextRequest.maxMag = max + 0.01;
}


function getSettingsMenuTable(){
    return  "<div class = menu-body>"
        +"<table class=settings-table>"
        + "<tbody>"
            +"<tr>"
                + "<td><p>color by</p></td>"
                + "<td>"
                    + "<div class='menu-select-box' id = 'color-selector'>"
                        + "<select class = 'menu-selector selectpicker'  data-width='auto' >"
                            +" <option>magnitude</option>"
                            + "<option>date</option>"
                            + "<option>depth</option>"
                        + "</select>"
                    + "</div>"
                +"</td>"
                + "</tr>"
                +"<td><p>3d view</p></td>"
                + "<td>"
                    + "<div class='menu-switch-box ' id = 'view-selector'>"
                        + "<select class = 'menu-selector selectpicker' data-width='auto'>"
                            +"<option>off</option>"
                            + "<option>on</option>"
                        + "</select>"
                    + "</div>"
                + "</td>"
            + "</tr>"
        + "</tbody>"
    +"</table>";
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

$("#search-button").click(function() {
    $("#search-button").prepend("<i id = 'loading-icon' class='fa fa-spinner fa-spin'></i>");
    $("#search-button").prop("disabled",true);

        // $this.button('reset');
    setTimeout(doMultiRequest(nextRequest, function () {
        $("#loading-icon").remove();
        $("#search-button").prop("disabled",false);
    }), 0 );
});


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
                        +"<tr>"
                            + "<th>region</th>"
                            + "<td>"+ e.regionName + "</td>"
                        +"</tr>"
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