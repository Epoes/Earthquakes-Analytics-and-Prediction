package com.usi.model;

public class Magnitude {
    private float magnitude;
    private int id;
    private String type;
    private float uncertainty;

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
