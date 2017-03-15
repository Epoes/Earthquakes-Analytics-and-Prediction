package com.usi.API.google_maps;

import com.google.maps.model.LatLng;

import com.usi.model.Elevation;

import java.util.ArrayList;

public class ElevationMatrix {

    private LatLng nW = new LatLng(44.601352, 3.224855);
    private LatLng nE = new LatLng(48.006245, 13.711211);
    private LatLng SE = new LatLng(39.050091, 20.571935);
    private LatLng sW = new LatLng(34.626415, 11.374308);
    private double m1 = -8149453D/9974937D;
    private double c1 = 395644347319591D/9974937000000D;
    private double m2 = -3430362D/4478077D;
    private double c2 =  226078657231937D/4478077000000D;
    private MapsServices mapsServices;
    private ArrayList<Elevation> elevations;

    public ElevationMatrix() {
        this.mapsServices = new MapsServicesImpl();
        this.elevations = new ArrayList<>();
    }

    private LatLng pointOnLine(double x, double m, double c){
        double y =  m * x + c;
        return new LatLng(x, y);
    }

    public ArrayList<Elevation> createElevationMatrix() throws Exception{
        this.elevations.addAll(this.mapsServices.getElevation(this.nW, this.nE, 512));
        for(double i = this.nW.lat, j = this.nE.lat; i >= this.sW.lat; i -= 0.1, j -= 0.1) {
            LatLng start = this.pointOnLine(i, m1, c1);
            LatLng end = this.pointOnLine(j, m2, c2);
            this.elevations.addAll(this.mapsServices.getElevation(start, end, 512));
        }
        return this.elevations;
    }

}


