package com.usi;

import com.usi.API.FeedRSS.IngvQuery;
import com.usi.API.FeedRSS.IngvService;
import com.usi.API.twitter.Response;
import com.usi.model.EarthQuake;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class EarthquakesController {

    private IngvService ingvService = new IngvService();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");

    @RequestMapping(value = "/api/earthquakes/last-update", method = RequestMethod.GET)
    public ResponseEntity<?> getEarthquakes() {

        Calendar start = Calendar.getInstance();
        try {
            start.setTime(sdf.parse("1930-03-16 00:00:00 UTC"));
        }catch (Exception e){
            e.printStackTrace();
        }

        IngvQuery query = new IngvQuery(start, null);
        query.setOrderBy("time");
        query.setCount(1000);
        query.setMinMagnitude(2);
        try {
            Response<EarthQuake> response = ingvService.getEarthQuakes(query);
            for(EarthQuake e : (List<EarthQuake>) response.getContent()){
                e.getOrigin().setEarthQuake(null);
                e.getMagnitude().setEarthQuake(null);
            }
            return new ResponseEntity<Object>(response.getContent(), HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
