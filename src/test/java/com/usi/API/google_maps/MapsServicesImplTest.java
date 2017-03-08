package com.usi.API.google_maps;

import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.usi.API.google_maps.Location;
import com.usi.API.google_maps.MapsServices;
import com.usi.API.google_maps.MapsServicesImpl;
import com.usi.BaseIntegration;


import org.json.JSONObject;
import org.junit.Test;

public class MapsServicesImplTest extends BaseIntegration{

    @Test
    public void testGetLocation() throws UnirestException{
        MapsServices mapsServices = new MapsServicesImpl();
        Location location = mapsServices.getLocation(45.456580, 9.181541);
        System.out.println(location.getAdminLevel3());
        System.out.println(location.getAdminLevel2());
        System.out.println(location.getAdminLevel1());
        System.out.println(location.getCountry());
        assert(location != null);
    }
}
