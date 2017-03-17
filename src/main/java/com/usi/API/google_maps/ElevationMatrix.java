package com.usi.API.google_maps;

import com.google.maps.model.LatLng;

import com.usi.model.Elevation;

import java.util.ArrayList;

public class ElevationMatrix {
    private LatLng nW = new LatLng(47.243913, 6.366221);
    private LatLng nE = new LatLng(47.243913, 18.742255);
    private LatLng SE = new LatLng(36.170137, 18.742255);
    private LatLng sW = new LatLng(36.170137, 6.366221);
    private MapsServices mapsServices;
    private ArrayList<Elevation> elevations;

    public ElevationMatrix() {
        this.mapsServices = new MapsServicesImpl();
        this.elevations = new ArrayList<>();
    }

//    private LatLng pointOnLine(double x, double m, double c){
//        double y =  m * x + c;
//        return new LatLng(x, y);
//    }

    public ArrayList<Elevation> createElevationMatrix() throws Exception{
        for(double i = this.nW.lat, j = this.nE.lat; i >= this.sW.lat; i -= 0.1, j -= 0.1) {
//        for(double i = this.nW.lat, j = this.nE.lat, z = 0; z <3; i -= 0.009, j -= 0.009,  z++) {
            LatLng start = new LatLng(i,this.nW.lng);
            LatLng end = new LatLng(j,this.nW.lng + (this.nE.lng - this.nW.lng)/2);
            this.elevations.addAll(this.mapsServices.getElevation(start, end, 512).getContent());
            start.lng = end.lng;
            end.lng = this.nE.lng;
            this.elevations.addAll(this.mapsServices.getElevation(start, end, 512).getContent());
        }
        return this.elevations;
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


