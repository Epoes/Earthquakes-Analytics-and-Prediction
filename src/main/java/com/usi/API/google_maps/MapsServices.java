package com.usi.API.google_maps;


import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.json.JSONObject;

public interface MapsServices {
    public Location getLocation(Double latitude, Double longitude) throws UnirestException;
}
