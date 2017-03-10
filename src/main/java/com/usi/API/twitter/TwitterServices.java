package com.usi.API.twitter;

import com.usi.API.ConnectionStatus;

import org.springframework.social.twitter.api.Tweet;

import java.util.List;

public interface TwitterServices {

    List<Tweet> getNewEarthquakesTweet(long lastId);
    List<Tweet> getOldEarthquakesTweet();
    ConnectionStatus getConnectionStatus();





}
