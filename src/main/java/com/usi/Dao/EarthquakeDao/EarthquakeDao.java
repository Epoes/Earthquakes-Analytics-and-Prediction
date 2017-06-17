package com.usi.Dao.EarthquakeDao;

import com.usi.model.earthquake.Earthquake;
import com.usi.model.earthquake.Intensity;
import com.usi.model.query.IngvQuery;
import com.usi.model.earthquake.Magnitude;
import com.usi.model.earthquake.Origin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Service
public class EarthquakeDao {

    private final int bigLimit = 89000;
    private final int cores = Runtime.getRuntime().availableProcessors();
    private EntityManager em;
    SimpleDateFormat sdf;

    @Autowired
    public EarthquakeDao(EntityManager em) {
        this.em = em;
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    public List<Earthquake> selectEarthQuakes(IngvQuery request){
//        long startTime = System.currentTimeMillis();

        Query q = getQuery(request);
        List<Object[]> earthQuakesObjects = (List<Object[]>)q.getResultList();

        if(earthQuakesObjects.size() > bigLimit){
            parseEqObjectMultiCore(earthQuakesObjects);
            long endTime = System.currentTimeMillis();
//            System.out.println("Multi CPU:  "+ earthQuakesObjects.size() + " took " + ((endTime - startTime))+ " milliseconds");
            return parseEqObjectMultiCore(earthQuakesObjects);
        }


//        parseEqObjectSingle(earthQuakesObjects);
//        long endTime = System.currentTimeMillis();
//        System.out.println("Single CPU:  "+ earthQuakesObjects.size() + " took " + + ((endTime - startTime))+ " milliseconds");

        return parseEqObjectSingle(earthQuakesObjects);

    }

    public List<Earthquake> getEarthquakesWithIntensityNull(){
        final String query = "select * from earthquake as e, origin as o , magnitude as m where e.magnitude_earthquake = m.magnitude_id and e.origin_earthquake = o.origin_id and m.magnitude >= 3 and o.time > '2008-01-01' and intensity_earthquake is null";
        final Query q = em.createNativeQuery(query);
        List<Object[]> earthQuakesObjects = (List<Object[]>)q.getResultList();
        return parseEqObjectSingle(earthQuakesObjects);
    }

    public List<Object[]>selectEarthQuakesRow(IngvQuery request) {
        Query q = getQuery(request);
        List<Object[]> earthQuakesObjects = (List<Object[]>) q.getResultList();
        return earthQuakesObjects;
    }

    private Query getQuery(IngvQuery request) {
        final String prefix = "select * from earthquake e, origin o, magnitude m where " +
                "e.magnitude_earthquake = m.magnitude_id and e.origin_earthquake = o.origin_id ";

        String date = "and o.time BETWEEN ? and ? ";
        String magnitude = "and m.magnitude >= ? and m.magnitude <= ? ";
        String geo =  "and o.latitude >= ? and o.latitude <= ? and o.longitude >= ? and o.longitude <= ? ";
        String depth = "and depth >= ? and depth <= ? ";
        final String suffix = "order by o.time DESC limit ?;";

        final Query q = em.createNativeQuery(prefix + date + magnitude + geo + depth + suffix);

        q.setParameter(1, sdf.format(request.getStartTime().getTime()));
        q.setParameter(2, sdf.format(request.getEndTime().getTime()));

        q.setParameter(3, request.getMinMagnitude());
        q.setParameter(4, request.getMaxMagnitude());

        q.setParameter(5, request.getMinPoint().lat);
        q.setParameter(6, request.getMaxPoint().lat);
        q.setParameter(7, request.getMinPoint().lng);
        q.setParameter(8, request.getMaxPoint().lng);

        q.setParameter(9, request.getMinDepth());
        q.setParameter(10, request.getMaxDepth());

        q.setParameter(11, request.getCount());

        return q;

    }


    private List<Earthquake> parseEqObjectSingle(List<Object[]> earthQuakesObjects){
        return parseEqObject(earthQuakesObjects, 0, earthQuakesObjects.size(), null);
    }

    private List<Earthquake> parseEqObjectMultiCore(List<Object[]> earthQuakesObjects){
        int step = earthQuakesObjects.size()/4;
        List<Earthquake> earthquakes1 = new ArrayList<>(earthQuakesObjects.size());
        List<Earthquake> earthquakes2 = new ArrayList<>(step);
        List<Earthquake> earthquakes3 = new ArrayList<>(step);
        List<Earthquake> earthquakes4 = new ArrayList<>(earthQuakesObjects.size() - step);

        Thread t1 = new Thread(() -> parseEqObject(earthQuakesObjects, 0, step, earthquakes1));
        t1.start();

        Thread t2 = new Thread(() -> parseEqObject(earthQuakesObjects, step, step*2, earthquakes2));
        t2.start();

        Thread t3 = new Thread(() -> parseEqObject(earthQuakesObjects, step*2, step*3, earthquakes3));
        t3.start();

        Thread t4 = new Thread(() -> parseEqObject(earthQuakesObjects,  step*3, earthQuakesObjects.size(), earthquakes4));
        t4.start();
        try {
            t1.join();
            t2.join();
            t3.join();
            t4.join();

        }catch (Exception e){
            e.printStackTrace();
        }

        earthquakes1.addAll(earthquakes2);
        earthquakes1.addAll(earthquakes3);
        earthquakes1.addAll(earthquakes4);

        return earthquakes1;
    }


    private List<Earthquake> parseEqObject(List<Object[]> earthQuakesObjects, int head, int end, List<Earthquake> earthquakes ){

        if(earthquakes == null) {
            earthquakes = new ArrayList<>(earthQuakesObjects.size());
        }

        for(int i = head; i< end; i++){

            Object[] objects = earthQuakesObjects.get(i);

            Earthquake e = new Earthquake((int) objects[0]);
            e.setRegionName((String) objects[1]);
            Origin o = new Origin((int) objects[3]);

            Intensity intensity = new Intensity();
            if(objects[4] != null){
                BigInteger id =  (BigInteger) objects[4];
                intensity.setId(id.longValue());
            }
            e.setIntensity(intensity);

            o.setDepth((int) objects[6]);
            o.setLatitude((float) objects[7]);
            o.setLongitude((float) objects[8]);
            o.setTime((Date) objects[9]);

            Magnitude m = new Magnitude((int) objects[2]);
            m.setMagnitude((float) objects[11]);
            m.setType((String) objects[12]);
            m.setUncertainty((float) objects[13]);

            e.setOrigin(o);
            e.setMagnitude(m);
            earthquakes.add(e);
        }
        return earthquakes;
    }
}
