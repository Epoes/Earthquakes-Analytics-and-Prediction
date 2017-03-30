package com.usi.API;


import com.usi.BaseIntegration;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class EarthquakeHubTest extends BaseIntegration {

    @Autowired
    EarthquakeHub earthquakeHub;


    @Test
    public void updateEarthQuakesTest(){
        earthquakeHub.updateEarthQuakes();
    }
}
