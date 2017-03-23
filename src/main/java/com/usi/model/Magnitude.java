package com.usi.model;

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
    @Column(name = "id", updatable = true, nullable = false)
    private int id;

    @Column(name = "magnitude", nullable = false)
    private float magnitude;

    @Column(name = "type", nullable = false, length = 8)
    private String type;

    @Column(name = "uncertainty", nullable = false)
    private float uncertainty;

    @OneToOne(fetch= FetchType.EAGER, mappedBy="magnitude")
    private EarthQuake earthQuake;

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

    public EarthQuake getEarthQuake() {
        return earthQuake;
    }

    public void setEarthQuake(EarthQuake earthQuake) {
        this.earthQuake = earthQuake;
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
