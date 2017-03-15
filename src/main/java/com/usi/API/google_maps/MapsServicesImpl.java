package com.usi.API.google_maps;

import com.google.maps.ElevationApi;
import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.ElevationResult;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;

import com.usi.API.ConnectionStatus;
import com.usi.model.Elevation;
import com.usi.model.Location;
import com.usi.utils.APIKeys;

import java.util.ArrayList;

public class MapsServicesImpl implements MapsServices{
    private Location location;
    private Parser parser;
    private GeoApiContext context;
    private ConnectionStatus connectionStatus;
    private ArrayList<Elevation> elevations;

    public MapsServicesImpl() {
        this.parser = new Parser();
        this.context = new GeoApiContext().setApiKey(APIKeys.GoogleMapsKey);
    }

    public ConnectionStatus getConnectionStatus() {
        return connectionStatus;
    }

    public void setConnectionStatus(ConnectionStatus connectionStatus) {
        this.connectionStatus = connectionStatus;
    }

    public Location getLocation(Double latitude, Double longitude) throws Exception{
        LatLng latlng = new LatLng(latitude, longitude);
        GeocodingResult[] results = GeocodingApi.newRequest(this.context).latlng(latlng).await();
        this.location = this.parser.parseGeocode(results[0].addressComponents);
        return this.location;
    }

    public ArrayList<Elevation> getElevation(LatLng start, LatLng end, int samples) throws Exception{
        ElevationResult[] result = ElevationApi.getByPath(this.context, samples, start, end).await();
        this.elevations = this.parser.parseElevation(result);
        return this.elevations;
    }


}
