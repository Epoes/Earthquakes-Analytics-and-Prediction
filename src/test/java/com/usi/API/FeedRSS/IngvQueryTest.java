//package com.usi.API.FeedRSS;
//
//
//import com.google.maps.model.LatLng;
//
//import com.usi.model.earthquake.IngvQuery;
//
//import org.junit.Test;
//
//import java.net.URL;
//import java.text.SimpleDateFormat;
//import java.util.Calendar;
//
//import static org.junit.Assert.assertEquals;
//import static org.junit.Assert.assertNotNull;
//
//public class IngvQueryTest {
//
//
//
//    @Test
//    public void generateURITest(){
//        final String result = "http://webservices.ingv.it/fdsnws/event/1/query?starttime=2016-03-16%2000:00:00&" +
//                "endtime=2017-03-18%2023:59:00&minmag=2.0&maxmag=9.0&mindepth=-900&maxdepth=100" +
//                "&minlat=35.0&maxlat=-80.0&minlon=5.0&maxlon=130.0&orderby=time&format=xml&limit=12";
//
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
//        Calendar start = Calendar.getInstance();
//        Calendar end = Calendar.getInstance();
//        try {
//            start.setTime(sdf.parse("2016-03-16 00:00:00 UTC"));
//            end.setTime(sdf.parse("2017-03-18 23:59:00 UTC"));
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//
//        IngvQuery query = new IngvQuery(start, end);
//        query.setCount(12);
//        query.setMaxMagnitude(9);
//        query.setMaxPoint(new LatLng(-80, 130));
//        query.setMaxDepth(100);
//        URL url = query.generateUrl();
//        assertNotNull(url);
//        assertEquals(192, url.getQuery().length());
//        assertEquals(result, url.toString());
//    }
//
//    @Test
//    public void generateURITestWrongQuery(){
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
//        Calendar start = Calendar.getInstance();
//        final String response = "http://webservices.ingv.it/fdsnws/event/1/query?starttime=2017-03-18%2000:00:00&" +
//                "minlat=35.0&maxlat=49.0&minlon=5.0&maxlon=20.0&orderby=time&format=xml&limit=100000";
//        try {
//            //start > end
//            start.setTime(sdf.parse("2017-03-18 00:00:00 UTC"));
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//
//        IngvQuery query = new IngvQuery(start, null);
//        query.setCount(100000);
//        query.setMaxDepth(40);
//        query.setMinDepth(100);
//        query.setMaxMagnitude(2);
//        query.setMinMagnitude(9);
//        query.setMaxPoint(new LatLng(200, 40));
//        URL url = query.generateUrl();
//        assertNotNull(url);
//        assertEquals(115, url.getQuery().length());
//        assertEquals(response, url.toString());
//    }
//}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
