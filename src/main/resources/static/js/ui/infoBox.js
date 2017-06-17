
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

    if(!settings.intensityMode && click.pickedEarthquake !== undefined && earthquakeId == click.pickedEarthquake.id){
        resetLastPoint();
    }else if(settings.intensityMode && earthquakeId == click.pickedEarthquake.id){
        cancelIntensity();
        resetLastPoint();
    }

}

function selectEarthquakeFromListElement(element){
    let e = findEarthquakeById($(element).parent().parent().attr("id"));
    if(settings.intensityMode && e.id != click.pickedEarthquake.id){
        return;
    }
    changeSelectedPoint(e.primitivePoint);
    flyTo(e.origin.latitude, e.origin.longitude, 10000);


}

function getInfoBoxDescription(e){
    var header = "<div class = 'earthquake-info-button' id = 'close-card' onclick = 'closeInfoCard(this)'><i class='fa fa-times' aria-hidden='true'></i></div>"
                 + "<div class = 'earthquake-info-button position' onclick = 'selectEarthquakeFromListElement(this)' ><i class='fa fa-compass' aria-hidden='true'></i></div>";

    if(e.intensity.id != 0){
        header+= "<div class = 'earthquake-info-button' onclick = 'showIntensity(this)'><i class='fa fa-circle' aria-hidden='true'></i></div>"
    }

    return "<div class = 'earthquake-info-card' id=" + e.id +">"
           + "<div class = 'earthquake-info-header' >"
           + "<div class = 'earthquake-info-id'>" + e.id + "</div>"
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








$("#charts-button").click(function(){
    drawChart();
});




function drawChart() {
    var dataArray = [['magnitude', 'size']];
    var minRoundMgn = round(generalEqInfo.minimumMagnitude, 0);
    var maxRoundMgn = round(generalEqInfo.maxMagnitude, 0);
    for(var i = minRoundMgn; i < maxRoundMgn + 1; i++){
        dataArray.push([i, 0]);
    }

    for(var i = 0; i < earthquakes.length; i++){
        var roundMagnitude = round(earthquakes[i].magnitude.magnitude, 0);
        dataArray[roundMagnitude-(minRoundMgn-1)][1] += 1;

    }

    var data = google.visualization.arrayToDataTable(dataArray);

    var options = {
        title: 'Company Performance',
        hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);

}/**
 * Created by mcalzana on 17/06/2017.
 */
