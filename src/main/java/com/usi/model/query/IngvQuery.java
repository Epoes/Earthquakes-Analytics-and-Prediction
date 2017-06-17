package com.usi.model.query;


import com.google.maps.model.LatLng;

import com.usi.model.Query;

import java.net.URI;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class IngvQuery implements Query {

    private final String baseUrl = "http://webservices.ingv.it/fdsnws/event/1/query?";
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public Calendar startTime;
    public Calendar endTime;

    //default value
    public float minMagnitude = 2.0f;
    public float maxMagnitude = 10.0f;
    public int minDepth = -900;
    public int maxDepth = 200000;

    public int count = 1000;

    //Italy default constraint
    public LatLng minPoint = new LatLng(35, 5);
    public LatLng maxPoint = new LatLng(49, 20);

    // "orderby" must be: "time, time-asc, magnitude, magnitude-asc"
    public String orderBy = "time";
    public String format = "xml";

    private int id;

    private String phase;



    public IngvQuery(float minMagnitude, float maxMagnitude, int maxDepth, int minDepth, Calendar startTime, Calendar endTime, int count, LatLng minPoint, LatLng maxPoint, String orderBy, String format) {
        this.minMagnitude = minMagnitude;
        this.maxMagnitude = maxMagnitude;
        this.maxDepth = maxDepth;
        this.minDepth = minDepth;
        this.startTime = startTime;
        this.endTime = endTime;
        this.count = count;
        this.minPoint = minPoint;
        this.maxPoint = maxPoint;
        this.orderBy = orderBy;
        this.format = format;
    }

    public IngvQuery(Calendar startTime, Calendar endTime) {
        if(isValidInterval(startTime, endTime)) {
            this.startTime = startTime;
            this.endTime = endTime;
        }
    }

    public IngvQuery(){};

    private boolean isValidInterval(Calendar startTime, Calendar endTime) {
        if(startTime != null && endTime != null){
            if(startTime.getTime().getTime() > endTime.getTime().getTime()){
                return false;
            }
        }
        return true;
    }

    public float getMinMagnitude() {
        return minMagnitude;
    }

    public void setMinMagnitude(float minMagnitude) {

        this.minMagnitude = minMagnitude;

    }

    public int getMinDepth() {
        return minDepth;
    }

    public void setMinDepth(int minDepth) {

        this.minDepth = minDepth;

    }

    public float getMaxMagnitude() {
        return maxMagnitude;
    }

    public void setMaxMagnitude(float maxMagnitude) {
            this.maxMagnitude = maxMagnitude;
    }

    public int getMaxDepth() {
        return maxDepth;
    }

    public void setMaxDepth(int maxDepth) {
            this.maxDepth = maxDepth;

    }

    public Calendar getStartTime() {
        return startTime;
    }

    public void setStartTime(Date date) {
        this.startTime = Calendar.getInstance();
        startTime.setTime(date);
    }

    public void setStartTime(Calendar startTime) {
        this.startTime = startTime;
    }

    public Calendar getEndTime() {
        return endTime;
    }

    public void setEndTime(Date date) {
        this.endTime = Calendar.getInstance();
        endTime.setTime(date);
    }

    public void setEndTime(Calendar endTime) {
        this.endTime = endTime;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public LatLng getMinPoint() {
        return minPoint;
    }

    public void setMinPoint(LatLng minPoint) {
        if(!checkCoordinates(minPoint)) {
            return;
        }
        this.minPoint = minPoint;
    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    private boolean checkCoordinates(LatLng point) {
        if(point.lat < -90 || point.lat > 90 || point.lng < -180 || point.lng > 180){
            return false;
        }
        return true;
    }

    public LatLng getMaxPoint() {
        return maxPoint;
    }

    public void setMaxPoint(LatLng maxPoint) {
        if(!checkCoordinates(maxPoint)) {
            return;
        }
        this.maxPoint = maxPoint;
    }

    public String getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public URL generateBaseUrl(){

        URL url = null;

        String q = timeToString();
        q  += magnitudeToString();
        q+= depthToString();
        q+= latLngToString();
        q+= "orderby=" + orderBy + "&";
        q+= "format=" + format + "&";
        q+= "limit=" + count;
        try {
            URI uri = new URI("http", "webservices.ingv.it", "/fdsnws/event/1/query", q, null);
            url = uri.toURL();

        }catch (Exception e){
            e.printStackTrace();
        }

        return url;
    }

    public URL generateUrlById(){
        URL url = null;

        String q = "eventId=" + id + "&";
        q += "includeallorigins=true&";
        q += "includearrivals=true&";
        q += "includeallstationsmagnitudes=true&";
        try{
            URI uri = new URI("http", "webservices.ingv.it", "/fdsnws/event/1/query", q, null);
            url = uri.toURL();
        } catch (Exception e){
            e.printStackTrace();
        }
        return url;
    }

    private String latLngToString() {
        String latLngToString = "minlat=" + minPoint.lat + "&";
        latLngToString += "maxlat=" + maxPoint.lat + "&";
        latLngToString += "minlon=" + minPoint.lng + "&";
        latLngToString+= "maxlon=" + maxPoint.lng + "&";

        return latLngToString;


    }

    private String depthToString() {
        String depthString = "";
        if(!isDeltaPositive(minDepth, maxDepth)){
            return depthString;
        }

        depthString += "mindepth=" + minDepth + "&";
        depthString += "maxdepth=" + maxDepth + "&";
        return  depthString;
    }

    private String magnitudeToString() {
        String magnitudeFormat = "";
        if(!isDeltaPositive(minMagnitude, maxMagnitude)){
            return magnitudeFormat;
        }
        magnitudeFormat += "minmag=" + minMagnitude + "&";
        magnitudeFormat += "maxmag=" + maxMagnitude + "&";

        return magnitudeFormat;


    }

    private boolean isDeltaPositive(double min, double max) {
        if(min > max){
            return false;
        }
        return true;
    }


    private String timeToString() {
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        String timeFormat = "";
        if(!checkDeltaTime()){
            return timeFormat;
        }

        if(startTime != null){
            timeFormat += "starttime=" + sdf.format(startTime.getTime()) + "&";
        }

        if(endTime != null){
            timeFormat += "endtime=" + sdf.format(endTime.getTime()) + "&";
        }

        return timeFormat;

    }

    private boolean checkDeltaTime(){
        if(startTime != null && endTime != null){
            if(startTime.getTime().getTime() > endTime.getTime().getTime()){
                return false;
            }
        }
        return true;
    }

//    @Override
//    public String toString() {
//        return "IngvQuery{" +
//                ", startTime=" + sdf.format(startTime) +
//                ", endTime=" + sdf.format(endTime) +
//                ", minMagnitude=" + minMagnitude +
//                ", maxMagnitude=" + maxMagnitude +
//                ", minDepth=" + minDepth +
//                ", maxDepth=" + maxDepth +
//                ", count=" + count +
//                ", minPoint=" + minPoint +
//                ", maxPoint=" + maxPoint +
//                ", orderBy='" + orderBy + '\'' +
//                ", format='" + format + '\'' +
//                '}';
//    }
}
