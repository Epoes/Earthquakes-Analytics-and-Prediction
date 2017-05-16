package com.usi.API.google_maps;

import com.google.maps.model.LatLng;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.usi.API.twitter.Response;
import com.usi.model.Coordinate;

public interface MapsServices {
    Response getLocation(double latitude, double longitude);
    Response getElevation(Coordinate start, Coordinate end, int samples) throws UnirestException;
}
