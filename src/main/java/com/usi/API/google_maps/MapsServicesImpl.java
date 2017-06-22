package com.usi.API.google_maps;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.errors.InvalidRequestException;
import com.google.maps.errors.OverQueryLimitException;
import com.google.maps.errors.RequestDeniedException;
import com.google.maps.errors.ZeroResultsException;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import com.usi.model.Coordinate;
import com.usi.util.ConnectionStatus;
import com.usi.util.Response;
import com.usi.model.Location;
import com.usi.util.APIKeys;

import java.util.ArrayList;
import java.util.List;

public class MapsServicesImpl implements MapsServices{
    private Parser parser;
    private GeoApiContext context;
    private UrlGenerator urlGenerator;
    private String url;


    public MapsServicesImpl() {
        this.urlGenerator = new UrlGenerator();
        this.parser = new Parser();
        this.context = new GeoApiContext().setApiKey(APIKeys.GoogleMapsKey);
    }

    private Response errorHandler(Exception e){
        e.printStackTrace();
        if (e instanceof RequestDeniedException) {
            return new Response(ConnectionStatus.FORBIDDEN, null, e.getMessage());
        } else if (e instanceof ZeroResultsException) {
            return new Response(ConnectionStatus.ZERO_RESULTS, null, e.getMessage());
        } else if (e instanceof OverQueryLimitException) {
            return new Response(ConnectionStatus.OVER_QUERY_LIMIT, null, e.getMessage());
        } else if (e instanceof InvalidRequestException) {
            return new Response(ConnectionStatus.BAD_REQUEST, null, e.getMessage());
        }

        return new Response(ConnectionStatus.UNKNOWN, null, e.getMessage());
    }

    public Response getLocation(double latitude, double longitude){
        LatLng latlng = new LatLng(latitude, longitude);
        List<Location> location = new ArrayList<>();
        try {
            GeocodingResult[] results = GeocodingApi.newRequest(this.context).latlng(latlng).await();
            location.add(this.parser.parseGeocode(results[0].addressComponents));
            return new Response(ConnectionStatus.OK, location, null);
        } catch (Exception e){
            return this.errorHandler(e);

        }
    }

    public Response getElevation(Coordinate start, Coordinate end, int samples) throws UnirestException{
        this.url = this.urlGenerator.generateElevation(start, end, samples);
        HttpResponse<JsonNode> locationResponse = Unirest.get(this.url).asJson();
        if(locationResponse.getStatus() == 200)
            return new Response(ConnectionStatus.OK, this.parser.parseElevation(locationResponse.getBody().getObject()), null);
        else
            return new Response(ConnectionStatus.UNKNOWN, null, locationResponse.getStatusText());
    }


}
