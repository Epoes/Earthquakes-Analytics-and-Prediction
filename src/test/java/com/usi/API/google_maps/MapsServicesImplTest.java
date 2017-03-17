package com.usi.API.google_maps;

import com.google.maps.model.LatLng;

import com.usi.API.ConnectionStatus;
import com.usi.API.twitter.Response;
import com.usi.BaseIntegration;
import com.usi.model.Elevation;
import com.usi.model.Location;

import org.junit.Test;

import java.util.ArrayList;

import static org.junit.Assert.assertEquals;

public class MapsServicesImplTest extends BaseIntegration{

    @Test
    public void testGetLocationConnection(){
        MapsServices mapsServices = new MapsServicesImpl();
        Response response = mapsServices.getLocation(43.103148, 12.399769);
        assertEquals(ConnectionStatus.OK, response.getStatus());
    }

    @Test
    public void testGetAdminLevel3() {
        MapsServices mapsServices = new MapsServicesImpl();
        Response response = mapsServices.getLocation(43.103148, 12.399769);
        Location location = (Location) response.getContent().get(0);
        assertEquals("Perugia", location.getAdminLevel3());
    }

    @Test
    public void testGetAdminLevel2() {
        MapsServices mapsServices = new MapsServicesImpl();
        Response response = mapsServices.getLocation(43.103148, 12.399769);
        Location location = (Location) response.getContent().get(0);
        assertEquals("Provincia di Perugia", location.getAdminLevel2());
    }

    @Test
    public void testGetAdminLevel1() {
        MapsServices mapsServices = new MapsServicesImpl();
        Response response = mapsServices.getLocation(43.103148, 12.399769);
        Location location = (Location) response.getContent().get(0);
        assertEquals("Umbria", location.getAdminLevel1());
    }

    @Test
    public void testGetCountry() {
        MapsServices mapsServices = new MapsServicesImpl();
        Response response = mapsServices.getLocation(43.103148, 12.399769);
        Location location = (Location) response.getContent().get(0);
        assertEquals("Italy", location.getCountry());
    }

    @Test
    public void testGetElevationConnection() {
        MapsServices mapsServices = new MapsServicesImpl();
        LatLng start = new LatLng(43.103148, 12.399769);
        LatLng end = new LatLng(42.370574, 13.927859);
        Response response = mapsServices.getElevation(start, end, 512);
        assertEquals(ConnectionStatus.OK, response.getStatus());
    }

    @Test
    public void testGetElevationWrongSample() {
        MapsServices mapsServices = new MapsServicesImpl();
        LatLng start = new LatLng(43.103148, 12.399769);
        LatLng end = new LatLng(42.370574, 13.927859);
        Response response = mapsServices.getElevation(start, end, 513);
        assertEquals(ConnectionStatus.INVALID_REQUEST, response.getStatus());
    }

    @Test
    public void testGetElevationCorrect() {
        MapsServices mapsServices = new MapsServicesImpl();
        LatLng start = new LatLng(43.103148, 12.399769);
        LatLng end = new LatLng(42.370574, 13.927859);
        Response response = mapsServices.getElevation(start, end, 3);
        ArrayList<Elevation> elevations = (ArrayList<Elevation>) response.getContent();
        assertEquals(ConnectionStatus.OK, response.getStatus());
        assertEquals(407, elevations.get(0).getElevation());
    }


}
