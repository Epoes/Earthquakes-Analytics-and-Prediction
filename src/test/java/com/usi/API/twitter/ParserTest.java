//package com.usi.API.twitter;
//
//import com.usi.BaseIntegration;
//import com.usi.model.EarthQuake;
//
//import org.joda.time.DateTimeZone;
//import org.junit.Test;
//
//import java.text.SimpleDateFormat;
//
//import static org.junit.Assert.assertEquals;
//import static org.junit.Assert.assertNotNull;
//import static org.junit.Assert.assertNull;
//
//public class ParserTest extends BaseIntegration {
//
//
////    @BeforeClass
////    public static void parserServicesConstructorTest(){
////       twitterServices.connectToTwitter();
////    }
////    @Test
////    public void parseToEarthQuakes(){
////
////        //get last tweet
////        List<Tweet> tweets =  twitterServices.getOldEarthquakesTweet(0, 100).content;
////        List<EarthQuake> earthQuakes = Parser.parseToEarthQuakes(tweets);
////        assertTrue(tweets.size()>0);
////        assertEquals(tweets.size(), earthQuakes.size());
////    }
//
//    @Test
//    public void parseTest(){
//        String eqText = "#terremoto ML:3.1 2017-03-16 04:58:27 UTC Lat=42.90 Lon=13.09 Prof=9Km Zona=Macerata. http://bit.ly/2muIKSY";
//
//        EarthQuake earthQuake = Parser.parse(eqText);
//        assertNotNull(earthQuake);
//        assertEquals(3.1, earthQuake.getMagnitude(), 0.001);
//
//        //time in UTC
//        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
//        simpleDateFormat.setTimeZone(DateTimeZone.UTC.toTimeZone());
//        assertEquals("2017-03-16 04:58:27 UTC", simpleDateFormat.format(earthQuake.getTime().getTime()));
//
//        assertEquals(42.90, earthQuake.getLatitude(), 0.001);
//        assertEquals(13.09, earthQuake.getLongitude(), 0.001);
//        assertEquals(earthQuake.getDepth(), 9, 0.001);
//        assertEquals(earthQuake.getLink(), "http://bit.ly/2muIKSY");
//    }
//
//    @Test
//    public void parseWrongStringTest(){
//
//        //missing #terremoto
//        String eqText = "ML:3.1 2017-03-16 04:58:27 UTC Lat=42.90 Lon=13.09 Prof=9Km Zona=Macerata. http://bit.ly/2muIKSY";
//        EarthQuake earthQuake = Parser.parse(eqText);
//        assertNull(earthQuake);
//
//        //wrong date format
//        eqText =  "#terremoto ML:3.1 2017-03-16 04:58:27 GMA Lat=42.90 Lon=13.09 Prof=9Km Zona=Macerata. http://bit.ly/2muIKSY";
//        earthQuake = Parser.parse(eqText);
//        assertNull(earthQuake);
//
//        //missing km for Prof
//        eqText =  "#terremoto ML:3.1 2017-03-16 04:58:27 UTC Lat=42.90 Lon=13.09 Prof=9 Zona=Macerata. http://bit.ly/2muIKSY";
//        earthQuake = Parser.parse(eqText);
//        assertNull(earthQuake);
//    }
//
//}
