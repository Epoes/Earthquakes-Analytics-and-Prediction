Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

function dateFormatter(date) {
    var d = new Date(date);
    return dformat = [d.getDate().padLeft(),
                      (d.getMonth() + 1).padLeft(),
                      d.getFullYear()].join('/') + ' ' +
                     [d.getHours().padLeft(),
                      d.getMinutes().padLeft()].join(':');
}

function adjustRadius(magnitude){
    return magnitude * 10000;
}

function adjustColor(magnitude){
    if(magnitude > 0 && magnitude < 2){
        return "#83FF0B"
    }
    if(magnitude >= 2 && magnitude < 3){
        return "#e8e528"
    }
    if(magnitude >= 3 && magnitude < 4.5){
        return "#FFCA0B"
    }
    if(magnitude >= 4.5 && magnitude < 5.5){
        return "#E87401"
    }
    if(magnitude >= 5.5 && magnitude < 7){
        return "#FF1F01"
    }
    if(magnitude >= 7 && magnitude < 9){
        return "#A30C03"
    }
    if(magnitude >= 9 && magnitude < 13){
        return "#5B0C03"
    }

}