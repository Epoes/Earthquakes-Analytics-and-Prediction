package com.usi.API;


import com.usi.API.FeedRSS.IngvQuery;
import com.usi.API.FeedRSS.IngvService;
import com.usi.API.FeedRSS.RssService;
import com.usi.API.google_maps.MapsServices;
import com.usi.API.google_maps.MapsServicesImpl;
import com.usi.model.EarthQuake;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;


public class EarthQuakeHub {
    private MapsServices mapsServices;
    private RssService ingvService;
    private SimpleDateFormat sdf;
    private String oldestDate;

    boolean isRunning = true;

    public EarthQuakeHub() {
        mapsServices = new MapsServicesImpl();
        ingvService = new IngvService();
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
        oldestDate  = "2017-03-18 00:00:00 UTC";
    }


//    @Scheduled(fixedRate = 30000)
    public List<EarthQuake> updateEarthQuakes() {

        Calendar start = Calendar.getInstance();
        try {
            start.setTime(sdf.parse("2015-03-16 00:00:00 UTC"));
        }catch (Exception e){
            e.printStackTrace();
        }

        IngvQuery query = new IngvQuery(start, null);
        query.setOrderBy("time-asc");
        query.setCount(1);
        query.setMinMagnitude(2);
        try {
            List<EarthQuake> earthquakes = ingvService.getEarthQuakes(query).getContent();
            if (earthquakes == null) {
                throw new Exception("EARTHQUAKES NULL");
            } else {
                System.err.println(earthquakes);
            }
            return earthquakes;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public void update(){

    }

    public void  pause(){
        isRunning = false;
    }

    public void  start(){
        isRunning = true;
    }





}
