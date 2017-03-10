package com.usi.API.twitter;

import com.usi.models.EarthQuakes;

import java.util.List;

public interface TwitterServices {

    List<EarthQuakes> getNewestEarthquakes();
    List<EarthQuakes> getOldestEarthquakes();





}
