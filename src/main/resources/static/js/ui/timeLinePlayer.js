


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


/* ON INPUT ACTION */


$("#pause-button").hide();

$("#play-container").click(function(){
    playPause();
});

$("#stop-container").click(function(e){
    clearTimeLaps();
});

$("#speed-plus").click(function(e){
    changeTotalTime()
});

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
