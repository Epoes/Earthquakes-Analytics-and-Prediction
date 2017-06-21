package com.usi.model.earthquake;


import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "earthquake")
public class Earthquake {
    @Id
    @Column(name = "earthquake_id", updatable = false, nullable = false)
    private int id;

    @OneToOne(fetch= FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name="origin_earthquake")
    Origin origin;

    @OneToOne(fetch= FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name="magnitude_earthquake")
    Magnitude magnitude;

    @Column(name = "regionName", nullable = false, length = 255)
    String regionName;

    @OneToMany(mappedBy = "earthquake", cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<StationMagnitude> stationMagnitudes;

    @OneToMany(mappedBy = "earthquake")
    @JsonIgnore
    private List<Arrival> arrivals;

    @OneToOne(fetch= FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name="intensity_earthquake")
    private Intensity intensity;


    public List<StationMagnitude> getStationMagnitudes() {
        return stationMagnitudes;
    }

    public void setStationMagnitudes(List<StationMagnitude> stationMagnitudes) {
        this.stationMagnitudes = stationMagnitudes;
    }

    public Intensity getIntensity() {
        return intensity;
    }

    public void setIntensity(Intensity intensity) {
        this.intensity = intensity;
    }

    public List<Arrival> getArrivals() {
        return arrivals;

    }

    public void setArrivals(List<Arrival> arrivals) {
        this.arrivals = arrivals;
    }
//
//    public Intensity getIntensity() {
//        return intensity;
//    }
//
//    public void setIntensity(Intensity intensity) {
//        this.intensity = intensity;
//    }

    public Earthquake(int id){
        this.id = id;
    }

    public Earthquake(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Origin getOrigin() {
        return origin;
    }

    public void setOrigin(Origin origin) {
        this.origin = origin;
    }

    public Magnitude getMagnitude() {
        return magnitude;
    }

    public void setMagnitude(Magnitude magnitude) {
        this.magnitude = magnitude;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }


    @Override
    public String toString() {
        return "Earthquake{" +
                "id=" + id +
                ", origin=" + origin +
                ", magnitude=" + magnitude +
                ", regionName='" + regionName + '\'' +
                '}';
    }
}
