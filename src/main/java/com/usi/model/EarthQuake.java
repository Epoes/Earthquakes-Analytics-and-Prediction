package com.usi.model;


import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "earthquake")
public class EarthQuake {
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private int id;
    @Column(name = "magnitude")
    private float magnitude;
    private Calendar time;
    private float latitude;
    private float longitude;
    private float depth;
    private String link;

    public EarthQuake(float magnitude, Calendar time, float latitude, float longitude, float depth, String link) {
        this.magnitude = magnitude;
        this.time = time;
        this.latitude = latitude;
        this.longitude = longitude;
        this.depth = depth;
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
                ", deep=" + depth +
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

    public float getDepth() {
        return depth;
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

    public void setDepth(float depth) {
        this.depth = depth;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
