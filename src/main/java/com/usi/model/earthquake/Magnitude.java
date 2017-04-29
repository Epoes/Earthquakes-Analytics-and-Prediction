package com.usi.model.earthquake;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "magnitude")
public class Magnitude {
    @Id
    @Column(name = "magnitude_id", updatable = true, nullable = false)
    private int id;

    @Column(name = "magnitude")
    private float magnitude;

    @Column(name = "type", nullable = false, length = 8)
    private String type;

    @Column(name = "uncertainty", nullable = false)
    @JsonIgnore
    private float uncertainty;

    @OneToOne(fetch = FetchType.LAZY,  mappedBy="magnitude")
    @JsonIgnore
    private Earthquake earthquake;

    public Magnitude(int id){
        this.id = id;
    }

    public Magnitude(){}

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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float getUncertainty() {
        return uncertainty;
    }

    public void setUncertainty(float uncertainty) {
        this.uncertainty = uncertainty;
    }

    public Earthquake getEarthquake() {
        return earthquake;
    }

    public void setEarthquake(Earthquake earthquake) {
        this.earthquake = earthquake;
    }

    @Override
    public String toString() {
        return "Magnitude{" +
                "magnitude=" + magnitude +
                ", id=" + id +
                ", type='" + type + '\'' +
                ", uncertainty=" + uncertainty +
                '}';
    }
}
