package com.usi.util;


import com.usi.model.Coordinate;

public class GeographicDistance {

    private static final double earthRadius = 6371e3;

    public static double haversine(Coordinate start, Coordinate end){
        double lat1 = Math.toRadians(start.getLatitude());
        double lat2 = Math.toRadians(end.getLatitude());
        double deltaLat = Math.toRadians(end.getLatitude() - start.getLatitude());
        double deltaLng = Math.toRadians(end.getLongitude() - start.getLongitude());

        double a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLng/2), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

}
