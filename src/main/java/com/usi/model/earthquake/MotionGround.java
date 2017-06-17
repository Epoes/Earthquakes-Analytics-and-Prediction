package com.usi.model.earthquake;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "motion_ground")
public class MotionGround {

    @Id
    @GeneratedValue
    @Column(name = "motion_ground_id", updatable = false)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intensity_id", nullable = false)
    @JsonIgnore
    private Intensity intensity;

    @Column(name = "ground_lat")
    private float latitude;

    @Column(name = "ground_lng")
    private float longitude;

    @Column(name = "pga")
    private float pga;

    @Column(name = "pgv")
    private float pgv;

    @Column(name = "instrumental_intensity")
    private float MMIntensity;

    @Column(name = "distance")
    private float distance;


    public MotionGround(Intensity intensity, float MMIntensity) {
        this.intensity = intensity;
        this.MMIntensity = MMIntensity;
    }

    public MotionGround() {
    }

    public float getDistance() {
        return distance;
    }

    public void setDistance(float distance) {
        this.distance = distance;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Intensity getIntensity() {
        return intensity;
    }

    public void setIntensity(Intensity intensity) {
        this.intensity = intensity;
    }

    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }

    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public float getPga() {
        return pga;
    }

    public void setPga(float pga) {
        this.pga = pga;
    }

    public float getPgv() {
        return pgv;
    }

    public void setPgv(float pgv) {
        this.pgv = pgv;
    }

    public float getMMIntensity() {
        return MMIntensity;
    }

    public void setMMIntensity(float MMIntensity) {
        this.MMIntensity = MMIntensity;
    }
}
