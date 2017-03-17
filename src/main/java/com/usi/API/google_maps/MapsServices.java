package com.usi.API.google_maps;

import com.google.maps.model.LatLng;

import com.usi.API.twitter.Response;

public interface MapsServices {
    Response getLocation(double latitude, double longitude);
    Response getElevation(LatLng start, LatLng end, int samples);
}
