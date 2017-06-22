package com.usi.API.google_maps;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.usi.util.Response;
import com.usi.model.Coordinate;

public interface MapsServices {
    Response getLocation(double latitude, double longitude);
    Response getElevation(Coordinate start, Coordinate end, int samples) throws UnirestException;
}
