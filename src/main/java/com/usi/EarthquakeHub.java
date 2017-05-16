package com.usi;


import com.usi.API.google_maps.MapsServices;
import com.usi.API.google_maps.MapsServicesImpl;
import com.usi.API.twitter.Response;
import com.usi.model.earthquake.*;
import com.usi.repository.*;
import com.usi.services.earthquake.EarthquakeAdditionalInfoServiceImpl;
import com.usi.services.earthquakeService;
import com.usi.util.ConnectionStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@Service
public class EarthquakeHub {
    private MapsServices mapsServices;


    private earthquakeService ingvService;
    private EarthquakeAdditionalInfoServiceImpl additionalInfoService;
    private EarthquakeRepository earthquakeRepository;
    private MagnitudeRepository magnitudeRepository;
    private OriginRepository originRepository;
    private StationMagnitudeRepository stationMagnitudeRepository;
    private AmplitudeRepository amplitudeRepository;
    private StationRepository stationRepository;
    private ArrivalRepository arrivalRepository;
    private PickRepository pickRepository;
    private SimpleDateFormat sdf;
    private List<Integer> ids;

    boolean isRunning = true;

    Timer updateTimer;
    Timer getOldTimer;
    Date minDate;



    @Autowired
    public EarthquakeHub(EarthquakeRepository earthquakeRepository, MagnitudeRepository magnitudeRepository, OriginRepository originRepository, earthquakeService ingvService, EarthquakeAdditionalInfoServiceImpl additionalInfoService, StationMagnitudeRepository stationMagnitudeRepository, AmplitudeRepository amplitudeRepository, StationRepository stationRepository, ArrivalRepository arrivalRepository, PickRepository pickRepository) {
		this.earthquakeRepository = earthquakeRepository;
		this.magnitudeRepository = magnitudeRepository;
		this.originRepository = originRepository;
        this.ingvService = ingvService;
        this.additionalInfoService = additionalInfoService;
        this.stationMagnitudeRepository = stationMagnitudeRepository;
        this.amplitudeRepository = amplitudeRepository;
        this.stationRepository = stationRepository;
        this.arrivalRepository = arrivalRepository;
        this.pickRepository = pickRepository;
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

        updateTimer.schedule(myTask, 189999, 189999);

        float magnitude = 2.5f;
        ids = earthquakeRepository.getAllIds(magnitude).orElse(new ArrayList<>());

        TimerTask myTask2 = new TimerTask() {
            @Override
            public void run() {
                iterateIds();
                if(ids.size() > 0) {
                    try {
                        saveAdditionalInfo(ids.get(ids.size() - 1));
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                }
            }
        };

        getOldTimer.schedule(myTask2, 0, 1000);
    }

    private void iterateIds(){
        for(int i = this.ids.size() - 1; i >= 0; --i){
            if(this.checkId(this.ids.get(i), i)){
               continue;
            } else{
                break;
            }
        }
    }

    private boolean checkId(int id, int index){
        Optional<List<Arrival>> arrivals = this.arrivalRepository.getByEarthquakeId(id);
        if(arrivals.get().size() != 0){
            this.ids.remove(index);
            return true;
        }
        return false;
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

    public void saveAdditionalInfo(int id) throws ParseException {
        this.ids.remove(this.ids.size() - 1);
        IngvQuery query = new IngvQuery();
        query.setId(id);
        Response<StationMagnitude> response;
        Response<Arrival> response2;
        try{
            this.additionalInfoService.generateXml(query);
            response = this.additionalInfoService.getStationMagnitudes();
            response2 = this.additionalInfoService.getArrivals();
        } catch (Exception e){
            e.printStackTrace();
            return;
        }

        if(response.getStatus() != ConnectionStatus.OK){
            return;
        }

        List<StationMagnitude> stationMagnitudeList = response.getContent();
        Earthquake earthquake = earthquakeRepository.getById(id).orElse(null);
        String time = "2006-01-01 00:00:00 UTC";
        Date minimumTime = sdf.parse(time);

        System.out.println("start saving for earthquake " + id);
        if(earthquake.getOrigin().getTime().getTime() > minimumTime.getTime()) {
            for (StationMagnitude stationMagnitude : stationMagnitudeList) {
                this.amplitudeRepository.save(stationMagnitude.getAmplitude());
                this.stationRepository.save(stationMagnitude.getStation());
                stationMagnitude.setEarthquake(earthquake);
                this.stationMagnitudeRepository.save(stationMagnitude);
            }
            System.out.println("\n" + stationMagnitudeList.size() + " stationMagnitude updated!");
        }
        List<Arrival> arrivalList = response2.getContent();
        for (Arrival arrival : arrivalList) {
            this.stationRepository.save(arrival.getPick().getStation());
            this.pickRepository.save(arrival.getPick());
            arrival.setEarthquake(earthquake);
            this.arrivalRepository.save(arrival);
        }
        System.out.println("\n" + arrivalList.size() + " arrivals updated!");
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
        query.setCount(5000);
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
