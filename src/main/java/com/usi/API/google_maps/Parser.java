package com.usi.API.google_maps;


import com.google.maps.model.AddressComponent;
import com.google.maps.model.ElevationResult;

import com.usi.model.Elevation;
import com.usi.model.Location;

import java.util.ArrayList;

public class Parser {

    private Location location = new Location();

    public Parser() {

    }


    public Location parseGeocode(AddressComponent[] addressComponents){
        for(int i = 0; i < addressComponents.length; ++i){
            if(this.checkValidity(addressComponents, "administrative_area_level_3", i))
                location.setAdminLevel3(addressComponents[i].longName);
            if(this.checkValidity(addressComponents, "administrative_area_level_2", i))
                location.setAdminLevel2(addressComponents[i].longName);
            if(this.checkValidity(addressComponents, "administrative_area_level_1", i))
                location.setAdminLevel1(addressComponents[i].longName);
            if(this.checkValidity(addressComponents, "country", i))
                location.setCountry(addressComponents[i].longName);
        }
        return location;
    }

    private boolean checkValidity(AddressComponent[] addressComponents, String level, int index){
        return addressComponents[index].types[0].toString().equals(level);
    }

    public ArrayList<Elevation> parseElevation(ElevationResult[] results){
        ArrayList<Elevation> elevations = new ArrayList<>();
        for(int i = 0; i < results.length; ++i){
            Elevation elevation = new Elevation();
            elevation.setElevation((int) results[i].elevation);
            elevation.setLatLng(results[i].location);
            elevations.add(elevation);
        }
        return elevations;
    }
}
