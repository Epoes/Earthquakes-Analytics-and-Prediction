package com.usi;

import com.usi.API.FeedRSS.IngvService;
import com.usi.model.EarthQuake;
import com.usi.repository.EarthquakeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Controller
public class EarthquakesController {
    private EarthquakeRepository earthQuakeRepository;

    @Autowired
    public EarthquakesController(EarthquakeRepository earthQuakeRepository){
        this.earthQuakeRepository = earthQuakeRepository;
    }




    private IngvService ingvService = new IngvService();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");

    @RequestMapping(value = "/api/earthquakes/last-update/{count}/{magnitude}", method = RequestMethod.GET)
    public ResponseEntity<?> getEarthquakes(@PathVariable(value = "count") int count, @PathVariable(value = "magnitude") float magnitude) {

        List<EarthQuake> earthQuakes = earthQuakeRepository.getLastEarthquakes(count, magnitude).orElse(new ArrayList<EarthQuake>());



        for(EarthQuake e : (List<EarthQuake>) earthQuakes){
            e.getOrigin().setEarthQuake(null);
            e.getMagnitude().setEarthQuake(null);
        }
        return new ResponseEntity<Object>(earthQuakes, HttpStatus.OK);

    }

}
