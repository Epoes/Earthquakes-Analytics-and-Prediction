
let prevId = -1;
function showInfoBox(earthquake){
    var elm = $("#" + earthquake.id);
    if(elm.length == 0) {
        $(".earthquake-info").prepend(getInfoBoxDescription(earthquake))

    }


    $(".earthquake-info").css("right", "10px");
    $("#" +  prevId).css("background-color", "");
    $("#" +  earthquake.id).css("background-color", "rgba(48, 51, 54, 1)");
    prevId = earthquake.id;
    scrollTo(earthquake.id);
}

function closeInfoBox(){
    $(".earthquake-info").css("right", "-400px");
}

function deleteAllInfoBoxCards(){
    closeInfoBox();
    $(".earthquake-info").empty();
}

function scrollTo(elementId){
    var container = $('.earthquake-info');
    var scrollTo = $("#" + elementId);

    container.animate({
                          scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() - 12
                      });
}

function closeInfoCard(element){
    var cardElement = $(element).parent().parent();
    $(cardElement).hide('slow', function(){ $(cardElement).remove(); });

    var earthquakeId = cardElement.attr("id");

    if(!settings.intensityMode && selectedObjects.pickedEarthquake !== undefined && earthquakeId == selectedObjects.pickedEarthquake.id){
        resetLastPoint();
    }else if(settings.intensityMode && earthquakeId == selectedObjects.pickedEarthquake.id){
        cancelIntensity();
        resetLastPoint();
    }

}

function selectEarthquakeFromListElement(element){
    const high = 10000;
    let e = findEarthquakeById($(element).parent().parent().attr("id"));
    if(settings.intensityMode && e.id != selectedObjects.pickedEarthquake.id){
        return;
    }
    changeSelectedPoint(e.primitivePoint);
    if(!settings.depthMode) {
        flyTo(e.origin.latitude, e.origin.longitude, high);
    }else{
        flyTo(e.origin.latitude, e.origin.longitude, (generalEqInfo.maxDepth - e.origin.depth) + high);
    }


}

function getInfoBoxDescription(e){
    var header = "<div class = 'earthquake-info-button' id = 'close-card' onclick = 'closeInfoCard(this)'><i class='fa fa-times' aria-hidden='true'></i></div>"
                 + "<div class = 'earthquake-info-button position' onclick = 'selectEarthquakeFromListElement(this)' ><i class='fa fa-compass' aria-hidden='true'></i></div>";
    if(e.intensity.id != 0){
        header+= "<div class = 'earthquake-info-button' onclick = 'showIntensity(this)'><i class='fa fa-circle' aria-hidden='true'></i></div>"
    }

    let regionName = e.regionName;
    if(regionName.length > 23){
        regionName = regionName.substring(0,23);
        regionName += "..."
    }


    return "<div class = 'earthquake-info-card' id=" + e.id +">"
           + "<div class = 'earthquake-info-header' >"
           + "<div class = 'earthquake-info-id'>" + regionName + "</div>"
           + header
           + "</div>"
           + "<div >"
           +"<table>"
           + "<tbody>"
           +"<tr>"
           + "<th>magnitude</th>"
           + "<td>"+ e.magnitude.magnitude + " " + e.magnitude.type + "</td>"
           +"</tr>"
           +"<tr>"
           + "<th>date</th>"
           + "<td>"+ moment(e.origin.time).format(shortestDateFormat)  + "</td>"
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








$("#charts-button").click(function(){
    drawMagnitudeChart();
    // drawDateChart();

});

// function drawDateChart() {
//     var data = new google.visualization.DataTable();
//     data.addColumn('timeofday', 'Time of Day');
//     data.addColumn('number', 'Motivation Level');
//
//     for(var i = 0; i < earthquakes.length; i++){
//        let date = earthquakes[i].origin.time;
//
//
//     }
//
//     data.addRows([
//                      [{v: [8, 0, 0], f: '8 am'}, 1],
//                      [{v: [9, 0, 0], f: '9 am'}, 2],
//                      [{v: [10, 0, 0], f:'10 am'}, 3],
//                      [{v: [11, 0, 0], f: '11 am'}, 4],
//                      [{v: [12, 0, 0], f: '12 pm'}, 5],
//                      [{v: [13, 0, 0], f: '1 pm'}, 6],
//                      [{v: [14, 0, 0], f: '2 pm'}, 7],
//                      [{v: [15, 0, 0], f: '3 pm'}, 8],
//                      [{v: [16, 0, 0], f: '4 pm'}, 9],
//                      [{v: [17, 0, 0], f: '5 pm'}, 10],
//                  ]);
//
//     var options = {
//         title: 'Motivation Level Throughout the Day',
//         hAxis: {
//             title: 'Date',
//             // format: 'h:mm a',
//             // viewWindow: {
//             //     min: [7, 30, 0],
//             //     max: [17, 30, 0]
//             // }
//         },
//         vAxis: {
//             title: 'Number'
//         }
//     };
//
//     var chart = new google.visualization.AreaChart(
//         document.getElementById('chart_div_date'));
//
//     chart.draw(data, options);
//
// }




function drawMagnitudeChart() {
    var dataArray = [['magnitude', 'size']];
    var minRoundMgn = Math.floor(generalEqInfo.minimumMagnitude);
    var maxRoundMgn = Math.floor(generalEqInfo.maxMagnitude);
    for(var i = minRoundMgn; i < maxRoundMgn+1; i++){
        dataArray.push([i, 0]);
    }

    for(var i = 0; i < earthquakes.length; i++){
        var roundMagnitude = Math.floor(earthquakes[i].magnitude.magnitude);
        dataArray[roundMagnitude-(minRoundMgn-1)][1] += 1;

    }

    var data = google.visualization.arrayToDataTable(dataArray);

    var options = {
        title: 'Earthquake Magnitude Distribution',
        hAxis: {title: 'magnitude',  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div_magnitude'));
    chart.draw(data, options);

}
