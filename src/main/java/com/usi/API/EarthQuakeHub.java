package com.usi.API;


import com.usi.API.FeedRSS.IngvQuery;
import com.usi.API.FeedRSS.RssService;
import com.usi.API.google_maps.MapsServices;
import com.usi.API.google_maps.MapsServicesImpl;
import com.usi.API.twitter.Response;
import com.usi.model.Earthquake;
import com.usi.repository.EarthquakeRepository;
import com.usi.repository.MagnitudeRepository;
import com.usi.repository.OriginRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;


@Service
public class EarthquakeHub {
    private MapsServices mapsServices;


    private RssService ingvService;
    private EarthquakeRepository earthquakeRepository;
    private  MagnitudeRepository magnitudeRepository;
    private OriginRepository originRepository;
    private SimpleDateFormat sdf;



    boolean isRunning = true;

    Timer updateTimer;
    Timer getOldTimer;
    Date minDate;



    @Autowired
    public EarthquakeHub(EarthquakeRepository earthquakeRepository, MagnitudeRepository magnitudeRepository, OriginRepository originRepository, RssService ingvService) {
		this.earthquakeRepository = earthquakeRepository;
		this.magnitudeRepository = magnitudeRepository;
		this.originRepository = originRepository;
        this.ingvService = ingvService;
        mapsServices = new MapsServicesImpl();
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
        updateTimer = new Timer();
        getOldTimer = new Timer();

        updateEarthQuakes();
	}

    public void updateEarthQuakes() {

        TimerTask myTask = new TimerTask() {
            @Override
            public void run() {
                update();
            }
        };

        updateTimer.schedule(myTask, 0, 189999);

        TimerTask myTask2 = new TimerTask() {
            @Override
            public void run() {
                saveOldEarthQuakes();
            }
        };

//        getOldTimer.schedule(myTask2, 0, 60000);
    }




    public void update(){
        IngvQuery query = new IngvQuery();
        Calendar start = Calendar.getInstance();
        Date maxDate = originRepository.getMaxDate().orElse(new Date());
        start.setTime(maxDate);
        start.add(Calendar.DATE, -2);
        query.setStartTime(start);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

        query.setOrderBy("time");
        query.setCount(1000);
        query.setMinMagnitude(0);


        Response<Earthquake> response;
        try {
            response = ingvService.getEarthQuakes(query);
        }catch (Exception e){
            e.printStackTrace();
            return;
        }

        if(response.getStatus() != ConnectionStatus.OK){
            return;
        }

        List<Earthquake> earthquakes = response.getContent();
        for(Earthquake e : earthquakes){
            magnitudeRepository.save(e.getMagnitude());
            originRepository.save(e.getOrigin());
            earthquakeRepository.save(e);
        }
        System.out.println("\n" +sdf.format(start.getTime()) + ": " + earthquakes.size() + " earthquake updated!");

    }

    public void saveOldEarthQuakes(){
        String startTime = "1930-01-01 00:00:00 UTC";
        Calendar start = Calendar.getInstance();
        try {
            start.setTime(sdf.parse(startTime));
        }catch (Exception e){
            e.printStackTrace();
            return;
        }

        IngvQuery query = new IngvQuery();
        Calendar end = Calendar.getInstance();
//        Date minDate = originRepository.getMinDate().orElse(new Date());
       if(minDate == null) {
           try{
           minDate = sdf.parse("2016-10-29 00:26:05 UTC");
           }catch (Exception e){
               e.printStackTrace();
           }
       }

        end.setTime(minDate);
        query.setEndTime(end);
        query.setStartTime(start);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

        query.setOrderBy("time");
        query.setCount(1000);
        query.setMinMagnitude(0);
        query.setMaxMagnitude(2);


        Response<Earthquake> response;
        try {
            response = ingvService.getEarthQuakes(query);
        }catch (Exception e){
            e.printStackTrace();
            return;
        }

        if(response.getStatus() != ConnectionStatus.OK){
            return;
        }

        List<Earthquake> earthquakes = response.getContent();

        minDate = earthquakes.get(earthquakes.size()-1).getOrigin().getTime();
        for(Earthquake e : earthquakes){
            magnitudeRepository.save(e.getMagnitude());
            originRepository.save(e.getOrigin());
            earthquakeRepository.save(e);
        }
        System.out.println("oldestDate: " +sdf.format(earthquakes.get(earthquakes.size()-1).getOrigin().getTime().getTime()) + ": " + earthquakes.size() + " old earthquake updated!");

    }



    public void  pause(){
        isRunning = false;
    }

    public void  start(){
        isRunning = true;
    }







}
