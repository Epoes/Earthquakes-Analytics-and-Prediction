package com.usi.model.earthquake;

import com.google.maps.model.LatLng;
import com.usi.model.Elevation;
import com.usi.model.Query;

import java.net.URL;

public class ElevationQuery implements Query{

    private double minLatitude = 35;
    private double maxLatitude = 48;

    private double minLongitude = 5;
    private double maxLongitude = 19;

    private int minElevation = 0;
    private int maxElevation = 10000;

    public ElevationQuery(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude, int minElevation, int maxElevation) {
        this.minLatitude = minLatitude;
        this.maxLatitude = maxLatitude;
        this.minLongitude = minLongitude;
        this.maxLongitude = maxLongitude;
        this.minElevation = minElevation;
        this.maxElevation = maxElevation;
    }

    public ElevationQuery(){}


    public double getMinLatitude() {
        return minLatitude;
    }

    public void setMinLatitude(double minLatitude) {
        this.minLatitude = minLatitude;
    }

    public double getMaxLatitude() {
        return maxLatitude;
    }

    public void setMaxLatitude(double maxLatitude) {
        this.maxLatitude = maxLatitude;
    }

    public double getMinLongitude() {
        return minLongitude;
    }

    public void setMinLongitude(double minLongitude) {
        this.minLongitude = minLongitude;
    }

    public double getMaxLongitude() {
        return maxLongitude;
    }

    public void setMaxLongitude(double maxLongitude) {
        this.maxLongitude = maxLongitude;
    }

    public int getMinElevation() {
        return minElevation;
    }

    public void setMinElevation(int minElevation) {
        this.minElevation = minElevation;
    }

    public int getMaxElevation() {
        return maxElevation;
    }

    public void setMaxElevation(int maxElevation) {
        this.maxElevation = maxElevation;
    }

    @Override
    public URL generateBaseUrl() {
        return null;
    }




    @Override
    public String toString() {
        return "ElevationQuery{" +
                "minLatitude=" + minLatitude +
                ", maxLatitude=" + maxLatitude +
                ", minLongitude=" + minLongitude +
                ", maxLongitude=" + maxLongitude +
                ", minElevation=" + minElevation +
                ", maxElevation=" + maxElevation +
                '}';
    }
}
