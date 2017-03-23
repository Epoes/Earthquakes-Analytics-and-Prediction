package com.usi.API.google_maps;

import com.google.maps.model.LatLng;

import com.usi.model.Elevation;
import com.usi.model.Location;

import java.awt.*;
import java.util.ArrayList;

public class ElevationMatrix {
    private LatLng nW = new LatLng(47.243913, 6.366221);
    private LatLng nE = new LatLng(47.243913, 18.742255);
    private LatLng SE = new LatLng(36.170137, 18.742255);
    private LatLng sW = new LatLng(36.170137, 6.366221);
    private double magicNumber = 0.008996;
    private double earthRadius = 6.371;
    private MapsServices mapsServices;

    public ElevationMatrix() {
        this.mapsServices = new MapsServicesImpl();
    }

//    private LatLng pointOnLine(double x, double m, double c){
//        double y =  m * x + c;
//        return new LatLng(x, y);
//    }

    public ArrayList<Elevation> createElevationMatrix() throws Exception{
        ArrayList<Elevation> elevations = new ArrayList<>();
        for(double i = this.nW.lat, j = this.nE.lat; i >= this.sW.lat; i -= 0.1, j -= 0.1) {
//        for(double i = this.nW.lat, j = this.nE.lat, z = 0; z <3; i -= this.magicNumber, j -= this.magicNumber,  z++) {
            LatLng start = new LatLng(i,this.nW.lng);
            LatLng end = new LatLng(j,this.nW.lng + (this.nE.lng - this.nW.lng)/2);
            elevations.addAll(this.mapsServices.getElevation(start, end, 512).getContent());
            start.lng = end.lng;
            end.lng = this.nE.lng;
            elevations.addAll(this.mapsServices.getElevation(start, end, 512).getContent());
        }
        return elevations;
    }

    public double haversine(LatLng start, LatLng end){
        double lat1 = start.lat;
        double lat2 = end.lat;
        double deltaLat = lat2 - lat1;
        double deltaLng = end.lng - start.lng;
        double a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) + Math.cos(lat2) + Math.pow(Math.sin(deltaLng/2), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return this.earthRadius * c;
    }

//    public ArrayList<Double> getLatitudes(){
//        ArrayList<Double> latitudes = new ArrayList<>();
//        for(int i = 0; i < this.elevations.size(); ++i){
//            latitudes.add(this.elevations.get(i).getLatLng().lat);
//        }
//        return latitudes;
//    }
//
//    public ArrayList<Double> getLongitudes(){
//        ArrayList<Double> longitudes = new ArrayList<>();
//        for(int i = 0; i < this.elevations.size(); ++i){
//            longitudes.add(this.elevations.get(i).getLatLng().lng);
//        }
//        return longitudes;
//    }
//
//    public ArrayList<Integer> getElevations(){
//        ArrayList<Integer> elevations = new ArrayList<>();
//        for (int i = 0; i< this.elevations.size(); ++i){
//            elevations.add(this.elevations.get(i).getElevation());
//        }
//        return elevations;
//    }

//    public void writeToFile() throws Exception{
//        this.createElevationMatrix();
//        ArrayList<Double> latitudes = this.getLatitudes();
//        ArrayList<Double> longitudes = this.getLongitudes();
//        ArrayList<Integer> elevations = this.getElevations();
//        try{
//            PrintWriter writer = new PrintWriter("Elevation-Matrix.txt", "UTF-8");
//            for(int i = 0; i < this.elevations.size(); ++i) {
//                writer.print(latitudes.get(i).toString() + " ");
//            }
//            writer.println();
//            for(int i = 0; i < this.elevations.size(); ++i) {
//                writer.print(longitudes.get(i).toString() + " ");
//            }
//            writer.close();
//        } catch (IOException e) {
//            System.out.println(e.getMessage());
//        }
//    }

}


