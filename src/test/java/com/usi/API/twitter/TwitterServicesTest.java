package com.usi.API.twitter;


import com.usi.API.ConnectionStatus;
import com.usi.BaseIntegration;

import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.social.twitter.api.RateLimitStatus;
import org.springframework.social.twitter.api.Tweet;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class TwitterServicesTest extends BaseIntegration {

    private static TwitterServices twitterServices = new TwitterServicesImpl();

    @BeforeClass
    public static void twitterServicesConstructorTest(){
        Response res = twitterServices.connectToTwitter();
        assertNotNull(res);
        assertEquals(ConnectionStatus.OK, res.status);
        assertEquals(null, res.errorMessage);
        assertEquals(null, res.content);
    }


    @Test
    public void twitterServicesConstructorWrongCredentialTest() {
        TwitterServices twitterServices = new TwitterServicesImpl();
        Response res =  twitterServices.connectToTwitter("xxxxx", "kkkkkk");
        assertNotNull(res);
        assertEquals(ConnectionStatus.FORBIDDEN, res.status);

        System.out.println(res.errorMessage);
        assertEquals("403 Forbidden", res.errorMessage);
        assertEquals(null, res.content);

        }

    @Test
    public void getNewEarthquakesTweetTest(){
        long testId = 840544340627869698L;
        Date lastTweetDate = new Date(1489236362000L);
        Response res =  twitterServices.getNewEarthquakesTweet(testId, 10);
        assertEquals(ConnectionStatus.OK, res.status);
        assertEquals(null, res.errorMessage);

        assertNotNull(res.content);
        assertEquals(10, res.content.size());
        assertTrue(res.content.get(0).getClass().equals(Tweet.class));


        List<Tweet> tweetList = res.content;
        Set<Long> idSet = new HashSet<>();

        for(Tweet tweet : tweetList){
            assertNotEquals(testId, tweet.getId());

            //Test the source tweet
            assertEquals("INGVterremoti", tweet.getFromUser());
            assertEquals(1, tweet.getEntities().getHashTags().size());
            assertEquals("terremoto", tweet.getEntities().getHashTags().get(0).getText());

            //check all unique tweets
            assertTrue(!idSet.contains(tweet.getId()));
            idSet.add(tweet.getId());

            //check the tweet date
            assertTrue(tweet.getCreatedAt().getTime() > lastTweetDate.getTime());
        }
    }

    @Test
    public void getNewEarthquakesTweetUnconnectedErrorTest(){
        TwitterServices twitterServices = new TwitterServicesImpl();
        long testId = 836859056535060481L;
        Response res =  twitterServices.getNewEarthquakesTweet(testId, 10);
        assertEquals(ConnectionStatus.UNCONNECTED, res.status);
        assertEquals("Unable to connect to Twitter", res.errorMessage);
    }

    @Test
    public void getNewEarthquakesTweetInvalidParameter(){
        Response res =  twitterServices.getNewEarthquakesTweet(836859056535060481L, 101);
        assertEquals(ConnectionStatus.UNKNOWN, res.status);
        assertEquals("invalid parameter count", res.errorMessage);
        res =  twitterServices.getNewEarthquakesTweet(836859056535060481L, -2);
        assertEquals(ConnectionStatus.UNKNOWN, res.status);
        assertEquals("invalid parameter count", res.errorMessage);
    }

    @Test
    public void getSearchLimitTest(){
        Response res = twitterServices.getSearchLimit();

        //assert res
        assertEquals(ConnectionStatus.OK, res.status);
        assertEquals(null, res.errorMessage);
        assertNotNull(res.content);
        assertEquals(1, res.content.size());

        //assertPreContent
        RateLimitStatus rateLimit = (RateLimitStatus) res.content.get(0);

        //should remain 450 request every 15 minutes
        assertEquals(450, rateLimit.getQuarterOfHourLimit());

        twitterServices.getNewEarthquakesTweet(836859056535060481L, 5);
        res = twitterServices.getSearchLimit();
        RateLimitStatus rateLimitAfter = (RateLimitStatus) res.content.get(0);
        assertEquals(rateLimit.getRemainingHits() -1, rateLimitAfter.getRemainingHits());
    }

    @Test
    public void getUsrTimeLineLimitTest(){
        Response res = twitterServices.getUsrTimeLineLimit();
        //assert res
        assertEquals(ConnectionStatus.OK, res.status);
        assertEquals(null, res.errorMessage);
        assertNotNull(res.content);
        assertEquals(6, res.content.size());

        //assertPreContent
        RateLimitStatus rateLimit = (RateLimitStatus) res.content.get(2);
        assertEquals("/statuses/user_timeline", rateLimit.getEndpoint());
        assertEquals(1500, rateLimit.getQuarterOfHourLimit());



        twitterServices.getOldEarthquakesTweet(836859056535060481L, 1);
        res = twitterServices.getUsrTimeLineLimit();
        RateLimitStatus rateLimitAfter = (RateLimitStatus) res.content.get(2);
        assertEquals(rateLimit.getRemainingHits() -1, rateLimitAfter.getRemainingHits());
    }

    @Test
    public void getSearchLimitTestUnconnectedErrorTest() {
        TwitterServices twitterServices = new TwitterServicesImpl();
        Response res = twitterServices.getSearchLimit();
        assertEquals(ConnectionStatus.UNCONNECTED, res.status);
        assertEquals("Unable to connect to Twitter", res.errorMessage);
    }

    @Test
    public void getOldEarthquakesTweetTest(){
        long maxId = 838538625071656961L;
        Date maxDate = new Date(1488758162000L);

        int count = 200;
        Response res = twitterServices.getOldEarthquakesTweet(maxId, count);
        assertEquals(ConnectionStatus.OK, res.status);
        assertEquals(null, res.errorMessage);
        assertNotNull(res.content);

        List<Tweet> tweets = res.content;
        assertTrue(tweets.size() > 0);

        Set<Long> idSet = new HashSet<>();
        for(Tweet tweet : tweets){
            //Test the source tweet
            assertEquals("INGVterremoti", tweet.getFromUser());
            assertEquals(1, tweet.getEntities().getHashTags().size());
            assertTrue(!tweet.isRetweet());
            assertEquals("terremoto", tweet.getEntities().getHashTags().get(0).getText());

            //check all unique tweets
            assertTrue(!idSet.contains(tweet.getId()));
            idSet.add(tweet.getId());

            //check the tweet date
            assertTrue(tweet.getCreatedAt().getTime() <= maxDate.getTime());
        }
    }


    @Ignore
    @Test
    public void consumeAllApiEnduranceTest(){
        Response res = twitterServices.getSearchLimit();
        RateLimitStatus rateLimit = (RateLimitStatus) res.content.get(0);
        int requests = rateLimit.getRemainingHits();
        for(int i = 0; i < requests; i++){
            twitterServices.getNewEarthquakesTweet(836859056535060481L, 1);
        }
        res = twitterServices.getSearchLimit();
        rateLimit = (RateLimitStatus) res.content.get(0);
        assertEquals(ConnectionStatus.OK, res.status);
        assertEquals(0, rateLimit.getRemainingHits());
        res = twitterServices.getNewEarthquakesTweet(836859056535060481L, 1);
        assertEquals(ConnectionStatus.RATELIMITEXCEEDED, res.status);
        assertEquals("The rate limit has been exceeded.", res.errorMessage);
    }
}
