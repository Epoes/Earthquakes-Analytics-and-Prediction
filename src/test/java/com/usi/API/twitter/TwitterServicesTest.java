package com.usi.API.twitter;


import com.usi.BaseIntegration;

import org.junit.Test;

import static org.junit.Assert.assertNull;

public class TwitterServicesTest extends BaseIntegration {

    private TwitterServices twitterServices = new TwitterServicesImpl();

    @Test
    public void getNewestEarthquakesTest(){
        TwitterServices twitterServices = new TwitterServicesImpl();
        assertNull(twitterServices.getNewestEarthquakes());
    }
}
