package com.usi.API;


import com.usi.API.FeedRSS.IngvQuery;
import com.usi.API.FeedRSS.RssService;
import com.usi.API.google_maps.MapsServices;
import com.usi.API.google_maps.MapsServicesImpl;
import com.usi.API.twitter.Response;
import com.usi.model.EarthQuake;
import com.usi.repository.EarthquakeRepository;
import com.usi.repository.MagnitudeRepository;
import com.usi.repository.OriginRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;


//@Service
public class EarthQuakeHub {
    private MapsServices mapsServices;


    private RssService ingvService;
    private EarthquakeRepository earthquakeRepository;
    private  MagnitudeRepository magnitudeRepository;
    private OriginRepository originRepository;
    private SimpleDateFormat sdf;
    private IngvQuery query;

    boolean isRunning = true;

    Timer timer;


    @Autowired
    public EarthQuakeHub(EarthquakeRepository earthquakeRepository, MagnitudeRepository magnitudeRepository, OriginRepository originRepository,  RssService ingvService) {
		this.earthquakeRepository = earthquakeRepository;
		this.magnitudeRepository = magnitudeRepository;
		this.originRepository = originRepository;
        this.ingvService = ingvService;
        mapsServices = new MapsServicesImpl();
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
        query = new IngvQuery();

        updateEarthQuakes();
	}


//    @Scheduled(fixedRate = 30000)
    public void updateEarthQuakes() {
        Calendar start = Calendar.getInstance();
        Date maxDate = originRepository.getMaxDate().orElse(new Date());
        start.setTime(maxDate);
        start.add(Calendar.DATE, -2);
        query.setStartTime(start);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

        query.setStartTime(start);
        query.setOrderBy("time");
        query.setCount(300);
        query.setMinMagnitude(0);
        timer = new Timer();

        TimerTask myTask = new TimerTask() {
            @Override
            public void run() {
                update();
            }
        };
        timer.schedule(myTask, 0, 120000);
    }



    public void update(){
        Response<EarthQuake> response;
        try {
            response = ingvService.getEarthQuakes(query);
        }catch (Exception e){
            e.printStackTrace();
            return;
        }

        if(response.getStatus() != ConnectionStatus.OK){
            return;
        }

        List<EarthQuake> earthQuakes = response.getContent();
        Calendar start = Calendar.getInstance();
        start.setTime(earthQuakes.get(0).getOrigin().getTime());

        start.add(Calendar.DATE, -2);
        query.setStartTime(start);

        for(EarthQuake e : earthQuakes){
            magnitudeRepository.save(e.getMagnitude());
            originRepository.save(e.getOrigin());
            earthquakeRepository.save(e);
        }
        System.out.println("\n" +sdf.format(start.getTime()) + ": " + earthQuakes.size() + " earthquake updated!");

    }



    public void  pause(){
        isRunning = false;
    }

    public void  start(){
        isRunning = true;
    }







}
