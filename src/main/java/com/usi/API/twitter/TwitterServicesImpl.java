package com.usi.API.twitter;

import com.usi.API.ConnectionStatus;

import org.springframework.social.twitter.api.SearchParameters;
import org.springframework.social.twitter.api.SearchResults;
import org.springframework.social.twitter.api.Tweet;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.social.twitter.api.impl.TwitterTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;


public class TwitterServicesImpl implements TwitterServices{

    private final String consumerKey = "pHxUtircPycTVnxyfUz1qs6C7";
    private final String consumerSecret = "OFDC6v3Pc9FIrYjjMQDLrX1qzTmbmtYjucfuVPGafewR3vXAx4";
    private final String query = "from:INGVterremoti #terremoto";
    private Twitter twitter;
    private ConnectionStatus connection;


    public TwitterServicesImpl(){
        try{
            twitter = getTwitter(consumerKey, consumerSecret);
//            List<Tweet> tweets = twitter.searchOperations().search("from:INGVterremoti #terremoto").getTweets();
            connection = ConnectionStatus.OK;
        }catch (Exception e){
            errorHandler(e);
        }




//        for(Tweet tweet : tweets){
//            System.out.println(tweet.getText());
//        }
//        Map<ResourceFamily, List<RateLimitStatus>> statuses = twitter.userOperations().getRateLimitStatus(ResourceFamily.SEARCH);
//        System.out.println(statuses.get(ResourceFamily.SEARCH).get(0).getRemainingHits());
    }

    public TwitterServicesImpl(String consumerKey, String consumerSecret) {
        try {
            twitter = getTwitter(consumerKey, consumerSecret);
            connection = ConnectionStatus.OK;
        } catch (Exception e) {
            errorHandler(e);
        }
    }

    public ConnectionStatus getConnectionStatus(){
        return this.connection;
    }

    private Twitter getTwitter(String consumerKey, String consumerSecret) throws Exception {
        return new TwitterTemplate(consumerKey, consumerSecret);
    }

    private void errorHandler(Exception e){
        e.printStackTrace();
        if (e instanceof HttpClientErrorException) {
            connection = ConnectionStatus.FORBIDDEN;
        } else if (e instanceof ResourceAccessException) {
            connection = ConnectionStatus.OFFLINE;
        }
    }


    public List<Tweet> getNewEarthquakesTweet(long lastId){
        SearchParameters searchParameters = new SearchParameters(query);
        searchParameters.sinceId(lastId);

        SearchResults res = twitter.searchOperations().search(searchParameters);
        return res.getTweets();
    }

    public List<Tweet> getOldEarthquakesTweet() {
        return null;
    }
}
