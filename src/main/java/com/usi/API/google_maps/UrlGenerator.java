package com.usi.API.google_maps;

public class UrlGenerator {
    private String apiKey = "AIzaSyDnnA66c4WfoVF03ZY725MR-vkA44AZFis";
    private String reverseGeoCoding = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";

    public UrlGenerator() {

    }

    public String generateLocation(Double latitude, Double longitude){
        return this.reverseGeoCoding + latitude.toString() + "," + longitude.toString() + "&key=" + this.apiKey;
    }
}
