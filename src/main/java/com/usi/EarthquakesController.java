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

import java.util.List;
import java.util.Optional;

@Controller
public class EarthquakesController {
    private EarthquakeRepository earthQuakeRepository;
    private EarthquakeDao earthquakeDao;

    @Autowired
    public EarthquakesController(EarthquakeRepository earthQuakeRepository, EarthquakeDao earthquakeDao){
        this.earthQuakeRepository = earthQuakeRepository;
        this.earthquakeDao = earthquakeDao;
    }


    @RequestMapping(value = "/api/earthquakes/query", method = RequestMethod.GET)
    public ResponseEntity<?> getEarthquakes(@RequestParam(value = "count", required = false) Optional<Integer> count){
        IngvQuery query = new IngvQuery();
        count.ifPresent(value -> query.setCount(value));


        System.out.println(query);

        return null;
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
        List<Earthquake> earthquakes = earthquakeDao.selectEarthQuakes(magnitude, count);

        long endTime = System.currentTimeMillis();

//        System.out.println("My implementation tooks " + ((endTime - startTime))+ " milliseconds");


        return new ResponseEntity<Object>(earthquakes, HttpStatus.OK);

    }

}
