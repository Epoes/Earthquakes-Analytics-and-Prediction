package com.usi.API.google_maps;

import com.google.maps.ElevationApi;
import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.errors.InvalidRequestException;
import com.google.maps.errors.OverQueryLimitException;
import com.google.maps.errors.RequestDeniedException;
import com.google.maps.errors.ZeroResultsException;
import com.google.maps.model.ElevationResult;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;

import com.usi.API.ConnectionStatus;
import com.usi.API.twitter.Response;
import com.usi.model.Elevation;
import com.usi.model.Location;
import com.usi.util.APIKeys;

import java.util.ArrayList;
import java.util.List;

public class MapsServicesImpl implements MapsServices{
    private Parser parser;
    private GeoApiContext context;


    public MapsServicesImpl() {
        this.parser = new Parser();
        this.context = new GeoApiContext().setApiKey(APIKeys.GoogleMapsKey);
    }

    private Response errorHandler(Exception e){
        e.printStackTrace();
        if (e instanceof RequestDeniedException) {
            return new Response(ConnectionStatus.REQUESTDENIED, null, e.getMessage());
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

    public Response getElevation(LatLng start, LatLng end, int samples){
        try {
            ElevationResult[] result = ElevationApi.getByPath(this.context, samples, start, end).await();
            ArrayList<Elevation> elevations = this.parser.parseElevation(result);
            return new Response(ConnectionStatus.OK, elevations, null);
        } catch (Exception e){
            return this.errorHandler(e);
        }
    }


}
