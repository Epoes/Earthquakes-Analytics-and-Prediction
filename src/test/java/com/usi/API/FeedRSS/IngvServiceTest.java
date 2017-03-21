package com.usi.API.FeedRSS;


import com.usi.API.twitter.Response;
import com.usi.BaseIntegration;
import com.usi.model.EarthQuake;

import org.junit.Test;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class IngvServiceTest extends BaseIntegration {

    IngvService ingvService = new IngvService();



    @Test
    public void getEarthQuakesTest(){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
        Calendar start = Calendar.getInstance();
        Calendar end = Calendar.getInstance();
        try {
            //start > end
            start.setTime(sdf.parse("2017-03-16 00:00:00 UTC"));
            end.setTime(sdf.parse("2017-03-18 23:59:00 UTC"));
        }catch (Exception e){
            e.printStackTrace();
        }

        IngvQuery query = new IngvQuery(start, end);
        Response<EarthQuake> response = null;

        try {
            response = ingvService.getEarthQuakes(query);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

}
