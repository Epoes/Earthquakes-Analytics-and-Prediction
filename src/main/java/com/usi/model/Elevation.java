package com.usi.model;

import com.google.maps.model.LatLng;

public class Elevation {
    private int elevation;
    private LatLng latLng;

    public Elevation(int elevation, LatLng latLng) {
        this.elevation = elevation;
    }

    public Elevation(){
    }

    public int getElevation() {
        return elevation;
    }

    public void setElevation(int elevation) {
        this.elevation = elevation;
    }

    public LatLng getLatLng() {
        return latLng;
    }

    public void setLatLng(LatLng latLng) {
        this.latLng = latLng;
    }
}
