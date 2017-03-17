package com.usi.model;


import java.util.Calendar;

public class EarthQuake {
    private int id;
    private float magnitude;
    private Calendar time;
    private float latitude;
    private float longitude;
    private float deep;
    private String link;


    public EarthQuake(float magnitude, Calendar time, float latitude, float longitude, float deep, String link) {
        this.magnitude = magnitude;
        this.time = time;
        this.latitude = latitude;
        this.longitude = longitude;
        this.deep = deep;
        this.link = link;
    }

    @Override
    public String toString() {
        return "EarthQuake{" +
                "magnitude=" + magnitude +
                ", id=" + id +
                ", time=" + time +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", deep=" + deep +
                ", link='" + link + '\'' +
                '}';
    }

    public EarthQuake(){

    }

    public int getId() {
        return id;
    }

    public float getMagnitude() {
        return magnitude;
    }

    public Calendar getTime() {
        return time;
    }

    public float getLatitude() {
        return latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public float getDeep() {
        return deep;
    }

    public String getLink() {
        return link;
    }

    public void setId(int id) {
        this.id = id;

    }

    public void setTime(Calendar time) {
        this.time = time;
    }

    public void setMagnitude(float magnitude) {
        this.magnitude = magnitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }

    public void setDeep(float deep) {
        this.deep = deep;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
