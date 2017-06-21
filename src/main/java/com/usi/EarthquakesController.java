package com.usi;

import com.usi.Dao.EarthquakeDao.ArrivalDao;
import com.usi.Dao.EarthquakeDao.EarthquakeDao;
import com.usi.Dao.EarthquakeDao.StationMagnitudeDao;
import com.usi.model.earthquake.Arrival;
import com.usi.model.earthquake.Earthquake;
import com.usi.model.earthquake.Intensity;
import com.usi.model.earthquake.MotionGround;
import com.usi.model.earthquake.StationMagnitude;
import com.usi.model.query.IngvQuery;
import com.usi.repository.EarthquakeRepository;
import com.usi.repository.IntensityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Controller
public class EarthquakesController {
    private EarthquakeRepository earthQuakeRepository;
    private EarthquakeDao earthquakeDao;
    private SimpleDateFormat sdf;
    private StationMagnitudeDao stationMagnitudeDao;
    private ArrivalDao arrivalDao;
    private IntensityRepository intensityRepository;
    EarthquakeHub earthquakeHub;

    @Autowired
    public EarthquakesController(EarthquakeRepository earthQuakeRepository, EarthquakeDao earthquakeDao, StationMagnitudeDao stationMagnitudeDao, ArrivalDao arrivalDao, IntensityRepository intensityRepository, EarthquakeHub earthquakeHub){
        this.earthQuakeRepository = earthQuakeRepository;
        this.earthquakeDao = earthquakeDao;
        this.stationMagnitudeDao = stationMagnitudeDao;
        this.arrivalDao = arrivalDao;
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.intensityRepository = intensityRepository;
        this.earthquakeHub = earthquakeHub;
    }


    @RequestMapping(value = "/api/earthquakes/query", method = RequestMethod.GET)
    public ResponseEntity<?> getEarthquakes(@RequestParam(value = "count", required = false) Optional<Integer> count,
                                            @RequestParam(value = "max_magnitude", required = false) Optional<Float> maxMagnitude,
                                            @RequestParam(value = "min_magnitude", required = false) Optional<Float> minMagnitude,
                                            @RequestParam(value = "start_time", required = false) String startTime,
                                            @RequestParam(value = "end_time", required = false) String endTime,
                                            @RequestParam(value = "min_lat", required = false) Optional<Float> minLat,
                                            @RequestParam(value = "min_lng", required = false) Optional<Float> minLng,
                                            @RequestParam(value = "max_lat", required = false) Optional<Float> maxLat,
                                            @RequestParam(value = "max_lng", required = false) Optional<Float> maxLng,
                                            @RequestParam(value = "min_depth", required = false) Optional<Integer> minDepth,
                                            @RequestParam(value = "max_depth", required = false) Optional<Integer> maxDepth){

        IngvQuery query = new IngvQuery();

        count.ifPresent(value -> query.setCount(value));
        maxMagnitude.ifPresent(value -> query.setMaxMagnitude(value));
        minMagnitude.ifPresent(value -> query.setMinMagnitude(value));
        minLat.ifPresent(value->query.getMinPoint().lat = value);
        minLng.ifPresent(value->query.getMinPoint().lng = value);
        maxLat.ifPresent(value->query.getMaxPoint().lat = value);
        maxLng.ifPresent(value->query.getMaxPoint().lng = value);
        minDepth.ifPresent(value->query.setMinDepth(value));
        maxDepth.ifPresent(value->query.setMaxDepth(value));
        try {
            query.setStartTime(parseStartTime(startTime));
            query.setEndTime(parseEndTime(endTime));
        }catch (ParseException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }



        List<Earthquake> earthquakeList = earthquakeDao.selectEarthQuakes(query);

        return new ResponseEntity<Object>(earthquakeList, HttpStatus.OK);
    }





    private Calendar parseStartTime(String time) throws ParseException{
        Calendar c = Calendar.getInstance();

        if(time == null){
            c.setTime(new Date());
            c.add(Calendar.DATE, - 1);
            return c;
        }

        c.setTime(sdf.parse(time));
        return c;
    }

    private Calendar parseEndTime(String time) throws ParseException{
        Calendar c = Calendar.getInstance();

        if(time == null){
            c.setTime(new Date());
            return c;
        }

        c.setTime(sdf.parse(time));
        return c;
    }

    public EarthquakesController() {
    }

    @RequestMapping(value = "/api/earthquakes/intensity/{id}", method= RequestMethod.GET)
    public ResponseEntity<?> getIntensityById(@PathVariable("id") long id){

        long startTime = System.currentTimeMillis();
        Intensity intensity = intensityRepository.findIntensityById(id).orElse(null);
        if(intensity == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        getMotionGroundGrid(intensity);
        ModelAndView modelAndView = getCompleteModelToSend(intensity);

        long endTime = System.currentTimeMillis();

        System.out.println("intensity took: " + ((endTime - startTime)/1000) + " seconds");
        return new ResponseEntity<>(modelAndView.getModel(), HttpStatus.OK);

    }

    private ModelAndView getCompleteModelToSend(Intensity intensity){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("id", intensity.getId());
        modelAndView.addObject("intensity", intensity.getMaxIntensity());
        modelAndView.addObject("PGA", intensity.getMaxPga());
        modelAndView.addObject("PGV", intensity.getMaxPgv());
        modelAndView.addObject("motionGroundList", intensity.getMotionGroundGrid());
        modelAndView.addObject("earthquakeId", intensity.getEarthquake().getId());

        return modelAndView;

    }

    private void getMotionGroundGrid(Intensity intensity){


        try {

            File f = new File("src/main/resources/intensity_grid_map/" + intensity.getId() + ".txt");

            BufferedReader b = new BufferedReader(new FileReader(f));

            String readLine = "";

            while ((readLine = b.readLine()) != null) {
                String[] values = readLine.split(" ");
                float latitude = Float.parseFloat(values[0]);
                float longitude = Float.parseFloat(values[1]);
                float MMI = Float.parseFloat(values[2]);

                MotionGround m = new MotionGround(intensity,MMI);
                m.setLongitude(longitude);
                m.setLatitude(latitude);
                intensity.addMotionGround(m);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    @RequestMapping(value = "/api/earthquakes/stationMagnitudes/query", method= RequestMethod.GET)
    public ResponseEntity<?> getStationMagnitudes(@RequestParam(value = "earthquake_id") Optional<Integer> earthquakeId,
                                                  @RequestParam(value = "max_magnitude", required = false) Optional<Float> maxMagnitude,
                                                  @RequestParam(value = "min_magnitude", required = false) Optional<Float> minMagnitude){
        IngvQuery query = new IngvQuery();

        earthquakeId.ifPresent(value -> query.setId(value));
        maxMagnitude.ifPresent(value -> query.setMaxMagnitude(value));
        minMagnitude.ifPresent(value -> query.setMinMagnitude(value));

        List<StationMagnitude> stationMagnitudeList = stationMagnitudeDao.selectStationMagnitudes(query);

        return new ResponseEntity<Object>(stationMagnitudeList, HttpStatus.OK);
    }

    @RequestMapping(value = "/api/earthquakes/arrivals/query", method = RequestMethod.GET)
    public ResponseEntity<?> getArrivals(@RequestParam(value = "earthquake_id") Optional<Integer> earthquakeId,
                                         @RequestParam(value = "phase", required = false) Optional<String> phase){
        IngvQuery query = new IngvQuery();

        earthquakeId.ifPresent(value -> query.setId(value));
        phase.ifPresent(value -> query.setPhase(value));

        List<Arrival> arrivalList = arrivalDao.selectArrivals(query);

        return new ResponseEntity<Object>(arrivalList, HttpStatus.OK);
    }




}
