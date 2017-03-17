package com.usi.API;


import com.usi.API.google_maps.MapsServices;
import com.usi.API.google_maps.MapsServicesImpl;
import com.usi.API.twitter.Parser;
import com.usi.API.twitter.Response;
import com.usi.API.twitter.TwitterServices;
import com.usi.API.twitter.TwitterServicesImpl;
import com.usi.model.EarthQuake;
import com.usi.model.Location;

import org.springframework.social.twitter.api.Tweet;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EarthQuakeHub {

    private static TwitterServices twitterServices = new TwitterServicesImpl();
    private static MapsServices mapsServices = new MapsServicesImpl();


//    @Scheduled(fixedRate = 60000)
    public void updateEarthQuakes() {
        Response res = twitterServices.connectToTwitter();
        if(!res.isValid()){
            System.err.println(res.getErrorMessage());
            return;
        }

        long lastId = getLastId();
        res = twitterServices.getNewEarthquakesTweet(lastId, 100);
        if(res.isValid()){
            List<Tweet> twitters =  res.getContent();
            if(twitters.size() > 0) {
                List<EarthQuake> earthquakes = Parser.parseToEarthQuakes(twitters);
                for(EarthQuake earthQuakes : earthquakes){
                    Response mapsResponse = mapsServices.getLocation(earthQuakes.getLatitude(), earthQuakes.getLongitude());
                    if(mapsResponse.isValid()){
                        List<Location> locations = mapsResponse.getContent();
                        earthQuakes.setLocation(locations.get(0));

                    }
                }

            }

        }

    }


    //TODO: do it.
    private long getLastId(){
        return 0;
    }









}
