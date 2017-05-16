package com.usi.API.google_maps;

import com.google.maps.model.LatLng;
import com.usi.model.Coordinate;
import com.usi.util.APIKeys;

public class UrlGenerator {
    private String apiKey = APIKeys.GoogleMapsKey;
    private String elevation = "https://maps.googleapis.com/maps/api/elevation/json?path=";

    public UrlGenerator(){
    }
    public String generateElevation(Coordinate start, Coordinate end, int samples){
        return this.elevation + start.getLatitude() + "," + start.getLongitude() + "%7C" + end.getLatitude() + "," + end.getLongitude() + "&samples=" + samples + "&key=" + this.apiKey;
    }
 }