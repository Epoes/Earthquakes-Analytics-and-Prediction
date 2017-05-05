//package com.usi.API.FeedRSS;
//
//
//import com.usi.BaseIntegration;
//import com.usi.model.earthquake.IngvQuery;
//import com.usi.util.SimpleHttpRequest;
//
//import org.apache.http.HttpResponse;
//import org.junit.Test;
//
//import java.net.URL;
//import java.text.SimpleDateFormat;
//import java.util.Calendar;
//
//import static org.junit.Assert.assertEquals;
//import static org.junit.Assert.assertNotNull;
//import static org.junit.Assert.assertNull;
//
//public class SimpleHttpRequestTest extends BaseIntegration{
//
//    SimpleHttpRequest httpRequest = new SimpleHttpRequest();
//
//
//
//    @Test
//    public void getTest(){
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
//        Calendar start = Calendar.getInstance();
//        Calendar end = Calendar.getInstance();
//        HttpResponse response = null;
//        try {
//            //start > end
//            start.setTime(sdf.parse("2017-03-16 00:00:00 UTC"));
//            end.setTime(sdf.parse("2017-03-18 23:59:00 UTC"));
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//
//        IngvQuery query = new IngvQuery(start, end);
//        query.setCount(20);
//
//        try {
//            URL url = query.generateUrl();
//            response = httpRequest.get(url);
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//        assertNotNull(response);
//        assertEquals(200, response.getStatusLine().getStatusCode());
//        assertNotNull(response.getEntity());
//    }
//
//    @Test
//    public void getCode400Test(){
//        HttpResponse response = null;
//        try {
//
//            URL url = new URL("http://webservices.ingv.it/fdsnws/event/1/query?starttime=2017-03-16%2000:00:00&" +
//                    "endtime=2017-03-18%2023:59:00&minmag=char.0&maxmag=10.0&mindepth=-10&maxdepth=10000&minlat=35.0&" +
//                    "maxlat=49.0&minlon=5.0&maxlon=20.0&orderby=time&format=xml&limit=20");
//
//            response = httpRequest.get(url);
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//        assertNotNull(response);
//        assertEquals(400, response.getStatusLine().getStatusCode());
//        assertNotNull(response.getEntity());
//    }
//
//    @Test
//    public void getCode204Test(){
//        HttpResponse response = null;
//        try {
//
//            URL url = new URL("http://webservices.ingv.it/fdsnws/event/1/query?&starttime=2017-03-17T08:07:19&" +
//                    "endtime=2017-03-18T23%3A59%3A59&minmag=9&maxmag=10&mindepth=-10&maxdepth=1000&minlat=35&" +
//                    "maxlat=49&minlon=5&maxlon=20&minversion=100&orderby=time-asc&format=xml&limit=100");
//
//            response = httpRequest.get(url);
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//        assertNotNull(response);
//        assertEquals(204, response.getStatusLine().getStatusCode());
//        assertNull(response.getEntity());
//    }
//
//    @Test
//    public void getCode404Test(){
//        HttpResponse response = null;
//        try {
//
//            URL url = new URL("http://webservices.ingv.it/event/1/query?&starttime=2017-03-17T08:07:19&" +
//                    "endtime=2017-03-18T23%3A59%3A59&minmag=9&maxmag=10&mindepth=-10&maxdepth=1000&minlat=35&" +
//                    "maxlat=49&minlon=5&maxlon=20&minversion=100&orderby=time-asc&format=xml&limit=100");
//
//            response = httpRequest.get(url);
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//        assertNotNull(response);
//        assertEquals(404, response.getStatusLine().getStatusCode());
//        assertNotNull(response.getEntity());
//    }
//}
