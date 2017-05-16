package com.usi.model;

import javax.persistence.*;
import java.math.BigInteger;

@Entity
@Table(name = "elevation")
public class Elevation {

    @Id
    @GeneratedValue
    @Column(name = "elevation_id", updatable = true, nullable = false)
    private int id;

    @Column(name = "elevation", nullable = false)
    private int elevation;

    @Column(name = "latitude", nullable = false)
    private double latitude;

    @Column(name = "longitude", nullable = false)
    private double longitude;


    public Elevation() {

    }

    public Elevation(int id){
        this.id = id;
    }

    public Elevation(int id, int elevation, double latitude, double longitude) {
        this.id = id;
        this.elevation = elevation;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public int getElevation() {
        return elevation;
    }

    public void setElevation(int elevation) {
        this.elevation = elevation;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
