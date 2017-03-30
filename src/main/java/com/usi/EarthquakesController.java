package com.usi;

import com.usi.API.FeedRSS.IngvQuery;
import com.usi.Dao.EarthQuakeDao.EarthquakeDao;
import com.usi.model.Earthquake;
import com.usi.repository.EarthquakeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

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
    @Autowired
    public EarthquakesController(EarthquakeRepository earthQuakeRepository, EarthquakeDao earthquakeDao){
        this.earthQuakeRepository = earthQuakeRepository;
        this.earthquakeDao = earthquakeDao;
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
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


    @RequestMapping(value = "/api/earthquakes/last-update/{count}/{magnitude}", method= RequestMethod.GET)
    public ResponseEntity<?> getEarthquakes(@PathVariable(value = "count") int count, @PathVariable(value = "magnitude") float magnitude) {


//        long startTime = System.currentTimeMillis();
//
//        List<Earthquake> earthQuakes1 = earthQuakeRepository.getLastEarthquakes(count, magnitude).orElse(new ArrayList<Earthquake>());
//
//        for(Earthquake e : (List<Earthquake>) earthQuakes1){
//            e.getOrigin().setEarthquake(null);
//            e.getMagnitude().setEarthquake(null);
//        }
//
//        long endTime = System.currentTimeMillis();
//        System.out.println("JPA tooks " + ((endTime - startTime))+ " milliseconds");





        long startTime = System.currentTimeMillis();
//        List<Earthquake> earthquakes = earthquakeDao.selectEarthQuakes(magnitude, count);

        long endTime = System.currentTimeMillis();

//        System.out.println("My implementation tooks " + ((endTime - startTime))+ " milliseconds");


        return new ResponseEntity<Object>(null, HttpStatus.OK);

    }

}
