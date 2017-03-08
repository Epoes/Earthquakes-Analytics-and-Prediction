package com.usi.API;

import com.usi.API.google_maps.MapsServices;
import com.usi.API.google_maps.MapsServicesImpl;
import com.usi.API.twitter.TwitterServices;

public class ApiFactory {

    static MapsServices x = new MapsServicesImpl();
    static TwitterServices y;

    public ApiFactory(MapsServices x, TwitterServices y){
        this.x = x;
        this.y = y;
    }


}
