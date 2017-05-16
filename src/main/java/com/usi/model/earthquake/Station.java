package com.usi.model.earthquake;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "station")
public class Station {
    @Id
    @Column(name = "station_id", updatable = false, nullable = false)
    private String id;

    @Column(name = "latitude")
    private float latitude;

    @Column(name = "longitude")
    private float longitude;

    @Column(name = "elevation")
    private float elevation;

    @Column(name = "station_name")
    private String name;

    @OneToMany(mappedBy = "station")
    private List<StationMagnitude> stationMagnitudes;

    @OneToMany(mappedBy = "station")
    private List<Pick> picks;

    public Station() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public float getElevation() {
        return elevation;
    }

    public void setElevation(float elevation) {
        this.elevation = elevation;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<StationMagnitude> getStationMagnitudes() {
        return stationMagnitudes;
    }

    public void setStationMagnitudes(List<StationMagnitude> stationMagnitudes) {
        this.stationMagnitudes = stationMagnitudes;
    }

    public List<Pick> getPicks() {
        return picks;
    }

    public void setPicks(List<Pick> picks) {
        this.picks = picks;
    }
}
