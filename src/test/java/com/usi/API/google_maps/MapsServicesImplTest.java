package com.usi.API.google_maps;

import com.usi.BaseIntegration;
import com.usi.model.Elevation;
import com.usi.model.Location;


import org.junit.Test;

import java.util.ArrayList;

public class MapsServicesImplTest extends BaseIntegration{

    @Test
    public void testGetLocation() throws Exception{
        MapsServices mapsServices = new MapsServicesImpl();
        Location location = mapsServices.getLocation(44.854831, 9.785610);
        System.out.println(location.getAdminLevel3());
        System.out.println(location.getAdminLevel2());
        System.out.println(location.getAdminLevel1());
        System.out.println(location.getCountry());
        assert(location != null);
    }

    @Test
    public void testGetElevation() throws Exception{
        ElevationMatrix elevation = new ElevationMatrix();
        ArrayList<Elevation> elevations = elevation.createElevationMatrix();
        Elevation db = elevations.get(27999);
        System.out.println("elevation = " + elevations);
        assert (elevations != null);
    }
}
