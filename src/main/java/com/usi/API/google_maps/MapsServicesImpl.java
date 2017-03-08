package com.usi.API.google_maps;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

public class MapsServicesImpl implements MapsServices{
    private UrlGenerator urlGenerator;
    private String url;
    private Location location;
    private Parser parser;

    public MapsServicesImpl() {
        this.urlGenerator = new UrlGenerator();
        this.parser = new Parser();
    }

    public Location getLocation(Double latitude, Double longitude) throws UnirestException{
        this.url = this.urlGenerator.generateLocation(latitude, longitude);
        HttpResponse<JsonNode> locationResponse = Unirest.get(this.url).asJson();
        this.location = this.parser.parse(locationResponse.getBody().getObject());
        return this.location;
    }


}
