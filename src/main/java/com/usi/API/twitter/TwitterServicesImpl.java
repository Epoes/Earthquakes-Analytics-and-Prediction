package com.usi.API.twitter;

import com.usi.API.ConnectionError;
import com.usi.models.EarthQuakes;

import org.springframework.social.twitter.api.Twitter;
import org.springframework.social.twitter.api.impl.TwitterTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;


public class TwitterServicesImpl implements TwitterServices{


    private final String consumerKey = "pHxUtircPycTVnxyfUz1qs6C7";
    private final String consumerSecret = "OFDC6v3Pc9FIrYjjMQDLrX1qzTmbmtYjucfuVPGafewR3vXAx4";
    private Twitter twitter;
    private ConnectionError connection;








    public TwitterServicesImpl(){
        try{
            twitter = getTwitter();
//            List<Tweet> tweets = twitter.searchOperations().search("from:INGVterremoti #terremoto").getTweets();
            connection =ConnectionError.OK;
        }catch (Exception e){
            e.printStackTrace();
            if(e instanceof HttpClientErrorException){
                connection = ConnectionError.FORBIDDEN;
                System.out.println(connection);
            }else if (e instanceof ResourceAccessException){
                connection = ConnectionError.OFFLINE;
            }
        }




//        for(Tweet tweet : tweets){
//            System.out.println(tweet.getText());
//        }
//        Map<ResourceFamily, List<RateLimitStatus>> statuses = twitter.userOperations().getRateLimitStatus(ResourceFamily.SEARCH);
//        System.out.println(statuses.get(ResourceFamily.SEARCH).get(0).getRemainingHits());


    }

    public ConnectionError getConnectionError(){
        return this.connection;
    }

    private Twitter getTwitter() throws Exception {
        return new TwitterTemplate(consumerKey, consumerSecret);
    }


    public List<EarthQuakes> getNewestEarthquakes(){

        return null;
    }

    public List<EarthQuakes> getOldestEarthquakes() {
        return null;
    }
}
