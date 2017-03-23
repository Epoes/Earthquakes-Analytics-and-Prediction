package com.usi.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "origin")
public class Origin {
    @Id
    @Column(name = "id", updatable = true, nullable = false)
    private int id;

    @Column(name = "time", nullable = false)
    private Date time;

    @Column(name = "latitude", nullable = false)
    private float latitude;

    @Column(name = "longitude", nullable = false)
    private float longitude;

    @Column(name = "depth", nullable = false)
    private int depth;

    @OneToOne(fetch= FetchType.EAGER, mappedBy="origin")
    private EarthQuake earthQuake;

    public Origin(int id){
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }

    public int getDepth() {
        return depth;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }

    public EarthQuake getEarthQuake() {
        return earthQuake;
    }

    public void setEarthQuake(EarthQuake earthQuake) {
        this.earthQuake = earthQuake;
    }

    @Override
    public String toString() {
        return "Origin{" +
                "id=" + id +
                ", time=" + time +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", depth=" + depth +
                '}';
    }
}

