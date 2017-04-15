
var start_time;
var end_time;
var minMag;
var maxMag;
var startDate = new Date();
//start time 100 days back
startDate.setDate(startDate.getDate()-100);



function setUpDateFilter(){
    var slider = $( "#slider-range-date" )
    slider.slider({
                      range: true,
                      min: new Date('1985-01-02').getTime() / 1000,
                      max: new Date().getTime() / 1000,
                      step: 86400,
                      values: [  startDate.getTime() / 1000, new Date().getTime() / 1000 ],
                      change: function (event, ui) {
                          setUpMaxMinDate(new Date(ui.values[0]*1000), new Date(ui.values[1]*1000));
                      },
                      slide: function( event, ui ) {
                          $( "#amount-date" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
                      }
                  });
    $( "#amount-date" ).val( (new Date(slider.slider( "values", 0 )*1000).toDateString()) +
                             " - " + (new Date(slider.slider( "values", 1 )*1000)).toDateString());
}




function setUpMaxMinDate(minTime, maxTime){
    minTime.setHours(00, 00, 00);
    maxTime.setHours(23, 59, 59);

    start_time = formatDateForQuery(minTime);
    end_time = formatDateForQuery(maxTime);
}

function formatDateForQuery(date){
    var year = date.getFullYear();
    var month = date.getMonth();
    month++;
    month = month + "";
    if(month.length === 1){
        month = "0" + month;
    }
    var day = date.getDate();
    day = day + "";
    if(day.length === 1){
        day = "0" + day;
    }
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    hour = hour + "";
    if(hour.length === 1){
        hour = "0" + hour;
    }
    min = min + "";
    if(min.length === 1){
        min = "0" + min;
    }
    sec = sec + "";
    if(sec.length === 1){
        sec = "0" + sec;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

$('#query-button').click(function () {
    doRequest();
    cancelPin();
    //$("#query-container").slideUp();
    //$("#searchBtn").css("visibility", "visible");
});

$("#searchBtn").click(function () {
    $("#query-container").slideDown();
    $("#searchBtn").css("visibility", "hidden");
})

function setUpMagnitudeFilter(){
    var slider = $( "#slider-range-magnitude" )
    slider.slider({
                      range: true,
                      min: 0,
                      max: 10,
                      step: 0.5,
                      values: [2, 10],
                      change: function (event, ui) {
                          setUpMagnitude(ui.values[0], ui.values[1]);
                      },
                      slide: function( event, ui ) {
                          $( "#amount-magnitude" ).val("Magnitude between: " + ui.values[0] + " and " + ui.values[1]);
                      }
                  });
    $( "#amount-magnitude" ).val( "Magnitude between: " + slider.slider( "values", 0 ) + " and " + slider.slider( "values", 1 ));
}




function setUpMagnitude(minMagn, maxMagn) {
    minMag = minMagn;
    maxMag = maxMagn;
}

$('.hamburger').click(function () {
    openNav("Left");
});

$('#closebtnLeft').click(function () {
    closeNav("Left");
});

$('#closebtnPart').click(function () {
    closeNav("Part");
});
/* Set the width of the side navigation to 250px */
function openNav(side) {
    document.getElementById("mySidenav" + side).style.width = "280px";
}

/* Set the width of the side navigation to 0 */
function closeNav(side) {
    document.getElementById("mySidenav" + side).style.width = "0";
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("info");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
    document.getElementById("defaultOpen").click();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function displayInfo(earthquake) {
    var date = new Date(earthquake.origin.time);
    $('#earthquake-info').append("<ul id='list-info'></ul>");
    $("#list-info").append("<li class='info-item'><a>Zone: " + earthquake.regionName +"</a></li>");
    $("#list-info").append("<li class='info-item'><a>Magnitude: " + earthquake.magnitude.magnitude + " " + earthquake.magnitude.type + "</a></li>");
    $("#list-info").append("<li class='info-item'><a>Depth: " + earthquake.origin.depth +" m</a></li>");
    $("#list-info").append("<li class='info-item'><a>Date: " + formatDateForList(date) +"</a></li>");

}

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
    seconds = addZeroToString(seconds)

    return day + " " + monthToString + " " + year + " at " + hours + "h" +minutes + "m" + seconds + "s";
}