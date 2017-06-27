package com.usi;


import com.usi.API.google_maps.MapsServices;
import com.usi.API.google_maps.MapsServicesImpl;
import com.usi.util.Response;
import com.usi.Dao.EarthquakeDao.EarthquakeDao;
import com.usi.model.Coordinate;
import com.usi.model.Query;
import com.usi.model.earthquake.Arrival;
import com.usi.model.earthquake.Earthquake;
import com.usi.model.earthquake.Intensity;
import com.usi.model.earthquake.StationMagnitude;
import com.usi.model.query.IngvQuery;
import com.usi.model.query.ShakeMapQuery;
import com.usi.repository.AmplitudeRepository;
import com.usi.repository.ArrivalRepository;
import com.usi.repository.EarthquakeRepository;
import com.usi.repository.IntensityRepository;
import com.usi.repository.MagnitudeRepository;
import com.usi.repository.MotionGroundRepository;
import com.usi.repository.OriginRepository;
import com.usi.repository.PickRepository;
import com.usi.repository.StationMagnitudeRepository;
import com.usi.repository.StationRepository;
import com.usi.services.earthquake.EarthquakeAdditionalInfoServiceImpl;
import com.usi.services.earthquakeService;
import com.usi.util.ConnectionStatus;
import com.usi.util.parser.IngvParser;
import com.usi.util.parser.Parser;
import com.usi.util.parser.ShakeMapParser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;


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
    private EarthquakeDao earthquakeDao;
    IntensityRepository intensityRepository;
    MotionGroundRepository motionGroundRepository;

    List<Earthquake> earthquakes;

    boolean isRunning = true;

    Timer updateTimer;
    Timer getOldTimer;
    Date minDate;



    @Autowired
    public EarthquakeHub(EarthquakeRepository earthquakeRepository, MagnitudeRepository magnitudeRepository,
                         OriginRepository originRepository, earthquakeService ingvService,
                         EarthquakeAdditionalInfoServiceImpl additionalInfoService,
                         StationMagnitudeRepository stationMagnitudeRepository, AmplitudeRepository amplitudeRepository,
                         StationRepository stationRepository, ArrivalRepository arrivalRepository, PickRepository pickRepository,
                         EarthquakeDao earthquakeDao, IntensityRepository intensityRepository, MotionGroundRepository motionGroundRepository) {
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
        this.earthquakeDao = earthquakeDao;
        this.intensityRepository = intensityRepository;
        this.motionGroundRepository = motionGroundRepository;


        mapsServices = new MapsServicesImpl();
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
        updateTimer = new Timer();
        getOldTimer = new Timer();
//        earthquakes = earthquakeDao.getEarthquakesWithIntensityNull();

        updateEarthQuakes();
	}

    public void updateEarthQuakes() {
        TimerTask earthquakeTask = new TimerTask() {
            @Override
            public void run() {

                updateEarthquakes();
            }
        };

        TimerTask intensityTask = new TimerTask() {
            @Override
            public void run() {
                updateIntensity();
            }
        };


        updateTimer.schedule(earthquakeTask,15000 , 189999);
//        updateTimer.schedule(intensityTask, 0, 5000);




        float magnitude = 2.5f;
        ids = earthquakeRepository.getAllIds(magnitude).orElse(new ArrayList<>());


//        TimerTask myTask2 = new TimerTask() {
//            @Override
//            public void run() {
//                iterateIds();
//                if(ids.size() > 0) {
//                    try {
//                        saveAdditionalInfo(ids.get(ids.size() - 1));
//                    } catch (ParseException e) {
//                        e.printStackTrace();
//                    }
//
//                }
//            }
//        };

//        getOldTimer.schedule(myTask2, 0, 1000);
    }


    private int count = 0;
    private void updateIntensity(){
        Earthquake e = earthquakes.get(count);
        if(count < earthquakes.size()) {
            Intensity intensity = getIntensity(e);
            if (intensity != null) {
                intensity.setEarthquake(e);
                e.setIntensity(intensity);
                saveIntensity(intensity);
                earthquakeRepository.save(e);
            }else{
                System.out.println("intensity for earthquake " + + e.getId()+ " not found");
            }

            count++;
        }else{
            System.out.println("Intensity ended");
        }
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


    public Intensity getIntensity(Earthquake earthquake){
        ShakeMapParser<Intensity> parser = new ShakeMapParser();
        Query query = new ShakeMapQuery(earthquake.getId());
        Intensity intensity;
        try {
            parser.setEpicenter(new Coordinate(earthquake.getOrigin().getLatitude(), earthquake.getOrigin().getLongitude()));
            intensity = ingvService.requestIntensity(parser, query, earthquake);

        }catch (Exception e){
            e.printStackTrace();
            return null;
        }

        return intensity;
    }

    public void updateEarthquakes(){
        IngvQuery query = new IngvQuery();
        IngvParser parser = new IngvParser();
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
            response = ingvService.requestEarthquakes(parser, query);
        }catch (Exception e){
            e.printStackTrace();
            return;
        }

        if(response.getStatus() != ConnectionStatus.OK){
            System.err.println(response.getContent());
            return;
        }

        List<Earthquake> earthquakes = response.getContent();
        for(Earthquake e : earthquakes){
            magnitudeRepository.save(e.getMagnitude());
            originRepository.save(e.getOrigin());
            if(e.getMagnitude().getMagnitude() >= 3) {
                Intensity intensity = getIntensity(e);
                if (intensity != null) {
                    intensity.setEarthquake(e);
                    e.setIntensity(intensity);
                    saveIntensity(intensity);
                }
            }
            earthquakeRepository.save(e);
        }
        System.out.println("\n" +sdf.format(start.getTime()) + ": " + earthquakes.size() + " earthquake updated!");

    }

    private void saveIntensity(Intensity intensity){
        if(writeMotionGroundGridOnFile(intensity)) {
            intensityRepository.save(intensity);
        }
    }



    private boolean writeMotionGroundGridOnFile(Intensity intensity){

        String path = "/home/share/intensity_grid_map/";
//        String path = "src/main/resources/intensity_grid_map/";

        StringBuilder stringBuilder = new StringBuilder(1210000);
        for(List<Float> motionGround : intensity.getMotionGroundGrid()){

            for(int i = 0; i < 3; i++){
                stringBuilder.append(motionGround.get(i));
                stringBuilder.append(" ");
            }
            stringBuilder.append("\n");
        }


        try{
            PrintWriter writer = new PrintWriter(path + intensity.getId() + ".txt", "UTF-8");
            writer.print(stringBuilder.toString());
            writer.close();
            return true;
        } catch (IOException e) {
            return false;
        }
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
        Earthquake earthquake = earthquakeRepository.findEarthquakeById(id).orElse(null);
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
        Parser<Earthquake> parser = new IngvParser();
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
            response = ingvService.requestEarthquakes(parser, query);
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



//select earthquakes from 2008-today
    //magnitude > 3.0


}
