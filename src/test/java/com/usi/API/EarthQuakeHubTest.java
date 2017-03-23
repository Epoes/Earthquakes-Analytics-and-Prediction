package com.usi.API;


import com.usi.BaseIntegration;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class EarthQuakeHubTest extends BaseIntegration {

    @Autowired
    EarthQuakeHub earthQuakeHub;


    @Test
    public void updateEarthQuakesTest(){
        earthQuakeHub.updateEarthQuakes();
    }
}
