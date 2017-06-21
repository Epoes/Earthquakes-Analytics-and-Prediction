
function setUpFooter() {
    for (var i = 0; i < 10; i++) {
        $("#color1").append("<p class='leggend-text' ></p>");
    }
}

/* ON INPUT ACTION */
$("#right-arrow-container").click(function(){
    nextColorMode();
});

$("#left-arrow-container").click(function(){
    prevColorMode();
});

$("#top-arrow-container").click(function(){
    nextFooterView();
});

function setCaptionByIntensity(){
    var i = 0;
    $('#color1').children().each(function () {
        $(this).text(convertIntegerToIntensity(i+1));
        $(this).css("left", 11.11 * i + "%");
        $(this).css("transform", "translate(-50%, 0%)");
        i++;
    });
    var stringColor = "";
    for(var i = 0; i < color.length; i++){
        stringColor += "rgba(" + Math.floor(color[i][0]*255) + ", " + Math.floor(color[i][1]*255) +
                       ", " + Math.floor(color[i][2]*255) + ", " + color[i][3] + ")";
        if(i != color.length-1){
            stringColor += ","
        }
    }

    $('#color1').css("background", "linear-gradient(to right, " + stringColor +")")
}

function setCaptionByMagnitude() {
    var i = 0;
    $('#color1').css("background", "")
    $('#color1').children().each(function () {
        if(i < 7) {
            if (i == 6) {
                $(this).text("> " + i);
            } else {
                $(this).text(i);
            }

            if (i > 0) {
                $(this).css("left", 16.66 * i + "%");
                $(this).css("transform", "translate(-50%, 0%)");
            }
            i++;
        }else{
            $(this).text("");
        }
    });
}

function setCaptionByDepth() {
    $('#color1').css("background", "")
    let i = 0;
    let step;
    let precision = 0;

    if(generalEqInfo.depthInterval == 0){
        step = 1000;
    }else {
        step = generalEqInfo.depthInterval / 6;
        if(step < 1000){
            precision = 1;
        }
    }
    $('#color1').children().each(function () {
        if(i < 7){
            var depth = (generalEqInfo.minDepth + (step * i))/1000;
            $(this).text((round(depth, precision)) + " km");
            $(this).css("left", 16.66 * i + "%");
            $(this).css("transform","translate(-50%, 0%)");
            i++;
        }else{
            $(this).text("");
        }


    });
}


function setCaptionByDate() {
    $('#color1').css("background", "");
    const length = 4;
    var step = generalEqInfo.timeInterval/length;
    var dateFormat = mediumDateFormat;
    if (generalEqInfo.timeInterval <= 2 * msPerDay){
        dateFormat = "h:mm a"
    }else if(generalEqInfo.timeInterval <= length*msPerDay){
        dateFormat = "h a, MMM Do"
    }else if(generalEqInfo.timeInterval <= 366*msPerDay){
        dateFormat = mediumDateFormat;
    }else if(generalEqInfo.timeInterval <= 2920*msPerDay){ //8 years
        dateFormat = "MMM YYYY"
    }else{
        dateFormat = "YYYY";
    }
    var children = $('#color1').children();

    $(children[0]).text(moment(generalEqInfo.minLongTime).format(mediumDateFormat));
    $(children[4]).text(moment(generalEqInfo.maxLongTime).format(mediumDateFormat));


    $(children[0]).css("left","0%");
    $(children[0]).css("transform","translate(-35%, 0%)");
    $(children[4]).css("left","100%");
    $(children[4]).css("transform","translate(-65%, 0%)");


    var i = 1;
    children.slice(1,4).each(function () {
        var date = generalEqInfo.minLongTime + (step * i);
        $(this).text(moment(date).format(dateFormat));
        $(this).css("left", 25 * i + "%");
        i++;
    });
    console.log("considerami")
    children.slice(5, children.length).each(function () {
        $(this).text("");
    });

}