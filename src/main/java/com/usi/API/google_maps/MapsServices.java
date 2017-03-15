package com.usi.API.google_maps;

import com.google.maps.model.LatLng;

import com.usi.model.Elevation;
import com.usi.model.Location;

import java.util.ArrayList;

public interface MapsServices {
    Location getLocation(Double latitude, Double longitude) throws Exception;
    ArrayList<Elevation> getElevation(LatLng start, LatLng end, int samples) throws Exception;
}
