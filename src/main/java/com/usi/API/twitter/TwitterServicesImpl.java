package com.usi.API.twitter;

import com.usi.API.ConnectionStatus;

import org.springframework.social.RateLimitExceededException;
import org.springframework.social.twitter.api.RateLimitStatus;
import org.springframework.social.twitter.api.ResourceFamily;
import org.springframework.social.twitter.api.SearchParameters;
import org.springframework.social.twitter.api.SearchResults;
import org.springframework.social.twitter.api.Tweet;
import org.springframework.social.twitter.api.Twitter;
import org.springframework.social.twitter.api.impl.TwitterTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.Iterator;
import java.util.List;
import java.util.Map;


public class TwitterServicesImpl implements TwitterServices {

    private final String consumerKey = "pHxUtircPycTVnxyfUz1qs6C7";
    private final String consumerSecret = "OFDC6v3Pc9FIrYjjMQDLrX1qzTmbmtYjucfuVPGafewR3vXAx4";
    private final String query = "from:INGVterremoti&#terremoto";
    private final String userName = "INGVterremoti";
    private final int FromUserId = 121049123;
    private Twitter twitter;

    public Response connectToTwitter(){
        try {
            twitter = getTwitter(consumerKey, consumerSecret);
            return new Response(ConnectionStatus.OK, null, null);
        }catch (Exception e){
            return errorHandler(e);
        }
    }

    public Response connectToTwitter(String consumerKey, String consumerSecret) {
        try {
            twitter = getTwitter(consumerKey, consumerSecret);
            return new Response(ConnectionStatus.OK, null, null);
        }catch (Exception e){
            return errorHandler(e);
        }
    }

    private Twitter getTwitter(String consumerKey, String consumerSecret) {
        return new TwitterTemplate(consumerKey, consumerSecret);
    }

    private Response errorHandler(Exception e){
        e.printStackTrace();
        if (e instanceof HttpClientErrorException) {
            return new Response(ConnectionStatus.FORBIDDEN, null, e.getMessage());
        } else if (e instanceof ResourceAccessException) {
            return new Response(ConnectionStatus.OFFLINE, null, e.getMessage());
        }else if (e instanceof RateLimitExceededException) {
            return new Response(ConnectionStatus.RATELIMITEXCEEDED, null, e.getMessage());
        }

        return new Response(ConnectionStatus.UNKNOWN, null, e.getMessage());
    }


    public Response getNewEarthquakesTweet(long sinceId, int count){
        if(twitter == null){
            return new Response(ConnectionStatus.UNCONNECTED, null, "Unable to connect to Twitter");
        }
        if(count>100 || count < 1){
            return new Response(ConnectionStatus.UNKNOWN, null, "invalid parameter count");
        }

        try {
            SearchParameters searchParameters = new SearchParameters(query);
            searchParameters.sinceId(sinceId);
            searchParameters.count(count);
            SearchResults res = twitter.searchOperations().search(searchParameters);
            checkAndDelete(res.getTweets());
            return new Response(ConnectionStatus.OK, res.getTweets(), null);
        }catch (Exception e){
           return errorHandler(e);
        }
    }

    public Response getSearchLimit(){
        return getLimit(ResourceFamily.SEARCH);
    }
    public Response getUsrTimeLineLimit(){
        return getLimit(ResourceFamily.STATUSES);
    }

    private Response getLimit(ResourceFamily resourceFamily){
        if(twitter == null){
            return new Response(ConnectionStatus.UNCONNECTED, null, "Unable to connect to Twitter");
        }
        try {
            Map<ResourceFamily, List<RateLimitStatus>> statuses = twitter.userOperations().getRateLimitStatus(resourceFamily);
            return new Response(ConnectionStatus.OK, statuses.get(resourceFamily), null);
        }catch (Exception e){
            return errorHandler(e);
        }
    }

    public Response getOldEarthquakesTweet(long maxId, int count) {
        if(twitter == null){
            return new Response(ConnectionStatus.UNCONNECTED, null, "Unable to connect to Twitter");
        }
        if(count>200 || count < 1){
            return new Response(ConnectionStatus.UNKNOWN, null, "invalid parameter count");
        }
        try {
            SearchParameters searchParameters = new SearchParameters(query);
            searchParameters.maxId(maxId);
            searchParameters.count(count);
            List<Tweet> tweets = twitter.timelineOperations().getUserTimeline(userName, count, -1, maxId);
            checkAndDelete(tweets);
            return new Response(ConnectionStatus.OK, tweets, null);
        }catch (Exception e){
            return errorHandler(e);
        }
    }


    private void checkAndDelete(List<Tweet> tweets){
        for(Iterator<Tweet> it = tweets.iterator(); it.hasNext();){
            Tweet tweet = it.next();
            if(!isValid(tweet)){
                it.remove();
            }
        }


        int idx = 0;


        for(Tweet tweet : tweets){
            if(!isValid(tweet)){
                tweets.remove(idx);
            }
            idx++;
        }
    }

    private boolean isValid(Tweet tweet){
        if(tweet.getFromUserId() != FromUserId){
            return false;
        }else if(tweet.getEntities().getHashTags().size() != 1){
            return false;
        }else if(!tweet.getEntities().getHashTags().get(0).getText().equals("terremoto")){
            return false;
        }else if(tweet.isRetweet()){
            return false;
        }
        return true;
    }
}
