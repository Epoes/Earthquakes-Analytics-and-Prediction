package com.usi.API.twitter;

import com.usi.model.EarthQuake;

import org.springframework.social.twitter.api.Tweet;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class Parser {

    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");

    public static List<EarthQuake> parseToEarthQuakes(List<Tweet> tweets){
        List<EarthQuake> earthQuakes = new ArrayList<>();
        for(Tweet tweet : tweets){
            EarthQuake earthQuake = parse(tweet.getText());
            if(earthQuake != null){
                earthQuakes.add(earthQuake);
            }else{
                System.err.println("err parsing tweet " + tweet.getId() + "with content: " + tweet.getText());
            }
        }

        return earthQuakes;
    }

    public static EarthQuake parse(String INGVTweet){

        String s = INGVTweet.substring(INGVTweet.indexOf("Zona="));
        String[] token =  INGVTweet.split(" ");
        String[] linkToken = s.split(" ");
        String link = linkToken[linkToken.length - 1];

        if(!token[0].equals("#terremoto")){
            return null;
        }

        try {
            float magnitude = Float.parseFloat(token[1].split(":")[1]);

            if(!token[4].equals("UTC")){
                System.err.println("A new timeZone: " + token[4]);
                return null;
            }
            Calendar cal = Calendar.getInstance();
            cal.setTime(sdf.parse(token[2] + " " + token[3] + " " + token[4]));


            float lat = Float.parseFloat(token[5].split("=")[1]);
            float lon = Float.parseFloat(token[6].split("=")[1]);
            String StDeep = (token[7].split("=")[1]);
            float deep = Float.parseFloat(StDeep.substring(0, StDeep.length() -2));


            return null;

        }catch (Exception e){
            e.printStackTrace();
            return null;
        }

    }

}
