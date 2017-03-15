package com.usi.API.twitter;

public interface TwitterServices {
    Response getNewEarthquakesTweet(long lastId, int count);
    Response getOldEarthquakesTweet(long maxId, int count);
    Response connectToTwitter(String consumerKey, String consumerSecret);
    Response connectToTwitter();
    Response getSearchLimit();
    Response getUsrTimeLineLimit();
}
