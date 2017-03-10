package com.usi.API.twitter;


import com.usi.API.ConnectionStatus;
import com.usi.BaseIntegration;

import org.junit.Test;
import org.springframework.social.twitter.api.Tweet;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class TwitterServicesTest extends BaseIntegration {

    private TwitterServices twitterServices = new TwitterServicesImpl();


    @Test
    public void twitterServicesConstructorTest() {
        TwitterServices twitterServices = new TwitterServicesImpl();
        assertNotNull(twitterServices);
        assertEquals(ConnectionStatus.OK, twitterServices.getConnectionStatus());

        twitterServices = new TwitterServicesImpl("", "");
        assertEquals(ConnectionStatus.FORBIDDEN, twitterServices.getConnectionStatus());
    }

    @Test
    public void getNewEarthquakesTweetTest(){

        List<Tweet> eqTweets =  twitterServices.getNewEarthquakesTweet(836859056535060481L);

        for(Tweet tweet : eqTweets){
            System.out.println(tweet.getId() + " " + tweet.getCreatedAt());
        }

    }
}
