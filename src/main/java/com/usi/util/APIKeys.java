package com.usi.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class APIKeys {


    public static String GoogleMapsKey;
    @Value("${GoogleKey}")
    public void APIKeys(String GoogleKey){
        GoogleMapsKey = GoogleKey;
    }
}
