package com.usi.model.earthquake;

import javax.persistence.*;

@Entity
@Table(name = "station_magnitude")
public class StationMagnitude {

    @Id
    @Column(name = "station_magnitude_id", updatable = false, nullable = false)
    private int id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "earthquake_id")
    private Earthquake earthquake;

    @Column(name = "magnitude")
    private float magnitude;

    @Column(name = "type", nullable = false, length = 8)
    private String type;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "amplitude_station_magnitude")
    Amplitude amplitude;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "station_magnitude_station")
    Station station;

    public StationMagnitude() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Earthquake getEarthquake() {
        return earthquake;
    }

    public void setEarthquake(Earthquake earthquake) {
        this.earthquake = earthquake;
    }

    public float getMagnitude() {
        return magnitude;
    }

    public void setMagnitude(float magnitude) {
        this.magnitude = magnitude;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Amplitude getAmplitude() {
        return amplitude;
    }

    public void setAmplitude(Amplitude amplitude) {
        this.amplitude = amplitude;
    }

    public Station getStation() {
        return station;
    }

    public void setStation(Station station) {
        this.station = station;
    }
}
