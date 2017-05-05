//package com.usi.API.FeedRSS;
//
//
//import com.usi.util.ConnectionStatus;
//import com.usi.API.twitter.Response;
//import com.usi.BaseIntegration;
//import com.usi.model.earthquake.Earthquake;
//import com.usi.services.earthquake.EarthquakeServiceImpl;
//import com.usi.model.earthquake.IngvQuery;
//
//import org.junit.Test;
//
//import java.text.SimpleDateFormat;
//import java.util.Calendar;
//import java.util.Date;
//import java.util.List;
//
//import static org.junit.Assert.assertEquals;
//import static org.junit.Assert.assertNotEquals;
//import static org.junit.Assert.assertNotNull;
//import static org.junit.Assert.assertNull;
//import static org.junit.Assert.assertTrue;
//public class earthquakeServiceTest extends BaseIntegration {
//
//    EarthquakeServiceImpl ingvService = new EarthquakeServiceImpl();
//
//
//
//    @Test
//    public void getEarthQuakesTest(){
//
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
//        Calendar start = Calendar.getInstance();
//        Calendar end = Calendar.getInstance();
//        try {
//            start.setTime(sdf.parse("2015-03-16 00:00:00 UTC"));
//            end.setTime(new Date());
//        }catch (Exception e){
//            e.printStackTrace();
//        }
//        int count = 20;
//        //the most update eq
//        IngvQuery query = new IngvQuery(start, end);
//        query.setCount(count);
//        query.setMinMagnitude(3);
//        query.setOrderBy("time");
//        Response<Earthquake> response = null;
//
//        try {
//            response = ingvService.getEarthQuakes(query);
//        }catch (Exception e) {
//            e.printStackTrace();
//        }
//        assertNotNull(response);
//        assertEquals(ConnectionStatus.OK, response.getStatus());
//        assertNull(response.getErrorMessage());
//        List<Earthquake> earthquakes =  response.getContent();
//        assertNotNull(earthquakes);
//        assertEquals(count, earthquakes.size());
//
//        for(Earthquake earthquake : earthquakes){
//            assertNotEquals(0, earthquake.getId());
//            assertNotNull(earthquake.getRegionName());
//            assertNotNull(earthquake.getMagnitude());
//            assertNotEquals(0, earthquake.getMagnitude().getId());
//            assertNotNull(earthquake.getOrigin());
//            assertNotEquals(0, earthquake.getOrigin().getId());
//            assertTrue("start Time (" + start.getTime().getTime() + ") should be less than eq time (" + earthquake.getOrigin().getTime().getTime() + ")",
//                    start.getTime().getTime() <= earthquake.getOrigin().getTime().getTime());
//            assertTrue("end Time (" + end.getTime().getTime() + ") should be grater than eq time (" + earthquake.getOrigin().getTime().getTime() + ")",
//                    end.getTime().getTime() >= earthquake.getOrigin().getTime().getTime());
//        }
//    }
//
//    @Test
//    public void getEarthQuakesCode204Test() {
//
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
//        Calendar start = Calendar.getInstance();
//        Calendar end = Calendar.getInstance();
//        try {
//            start.setTimeInMillis(new Date().getTime() - 20000);
//
//            end.setTime(new Date());
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        int count = 50;
//
//        //the most update eq
//        IngvQuery query = new IngvQuery(start, end);
//        query.setCount(count);
//        query.setMinMagnitude(10);
//        query.setOrderBy("time");
//        Response<Earthquake> response = null;
//
//
//        try {
//            response = ingvService.getEarthQuakes(query);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        assertNotNull(response);
//        assertNotNull(response.getStatus());
//        assertEquals(ConnectionStatus.ZERO_RESULTS, response.getStatus());
//        assertNull(response.getContent());
//    }
//
//    @Test
//    public void getEarthQuakesCode400Test() {
//
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
//        Calendar start = Calendar.getInstance();
//        Calendar end = Calendar.getInstance();
//        try {
//            start.setTimeInMillis(new Date().getTime());
//            end.setTime(new Date());
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        int count = 50;
//
//        //the most update eq
//        IngvQuery query = new IngvQuery(start, end);
//        Response<Earthquake> response = null;
//        try {
//            response = ingvService.getEarthQuakes(query);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        assertNotNull(response);
//        assertNotNull(response.getStatus());
//        assertEquals(ConnectionStatus.BAD_REQUEST, response.getStatus());
//        assertNull(response.getContent());
//    }
//
//
//
//
//
//}
