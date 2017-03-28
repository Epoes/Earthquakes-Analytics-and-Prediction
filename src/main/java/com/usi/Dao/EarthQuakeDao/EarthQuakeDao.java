package com.usi.Dao.EarthQuakeDao;

import com.usi.model.Earthquake;
import com.usi.model.Magnitude;
import com.usi.model.Origin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Service
public class EarthquakeDao {

    private final int bigLimit = 89000;
    private final int cores = Runtime.getRuntime().availableProcessors();
//    1000:
//        My implementation tooks 478 milliseconds
//        My implementation tooks 481 milliseconds

//    2000:
//        My implementation tooks 505 milliseconds
//        My implementation tooks 515 milliseconds
//
//    5000:
//        My implementation tooks 544 milliseconds
//        My implementation tooks 514 milliseconds
//
//    10000:
//        My implementation tooks 564 milliseconds
//        My implementation tooks 556 milliseconds
//
//    100000:
//        My implementation tooks 1170 milliseconds
//        My implementation tooks 1158 milliseconds





    private EntityManager em;

    @Autowired
    public EarthquakeDao(EntityManager em) {
        this.em = em;
    }

    public List<Earthquake> selectEarthQuakes(float magnitude, int count){
        long startTime = System.currentTimeMillis();

        final Query q = em.createNativeQuery("select * from earthquake e, origin o, magnitude m where " +
                "e.magnitude_earthquake = m.magnitude_id and m.magnitude > ? " +
                "and e.origin_earthquake = o.origin_id order by o.time DESC limit ?;");

        q.setParameter(1, magnitude);
        q.setParameter(2, count);
        List<Object[]> earthQuakesObjects = (List<Object[]>)q.getResultList();

        if(earthQuakesObjects.size() > bigLimit){
            parseEqObjectMultiCore(earthQuakesObjects);
            long endTime = System.currentTimeMillis();
            System.out.println("Multi CPU:  "+ earthQuakesObjects.size() + " took " + ((endTime - startTime))+ " milliseconds");
            return parseEqObjectMultiCore(earthQuakesObjects);
        }


        parseEqObjectSingle(earthQuakesObjects);
        long endTime = System.currentTimeMillis();
        System.out.println("Single CPU:  "+ earthQuakesObjects.size() + " took " + + ((endTime - startTime))+ " milliseconds");


        return parseEqObjectSingle(earthQuakesObjects);

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

        System.out.println("multi core list size: " +earthquakes1.size());

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
            o.setDepth((int) objects[5]);
            o.setLatitude((float) objects[6]);
            o.setLongitude((float) objects[7]);
            o.setTime((Date) objects[8]);

            Magnitude m = new Magnitude((int) objects[2]);
            m.setMagnitude((float) objects[10]);
            m.setType((String) objects[11]);
            m.setUncertainty((float) objects[12]);

            e.setOrigin(o);
            e.setMagnitude(m);
            earthquakes.add(e);
        }
        return earthquakes;
    }
}
