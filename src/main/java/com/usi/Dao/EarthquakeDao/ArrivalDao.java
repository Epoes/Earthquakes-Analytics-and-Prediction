package com.usi.Dao.EarthquakeDao;


import com.usi.model.earthquake.*;
import com.usi.model.query.IngvQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ArrivalDao {
    private EntityManager em;
    SimpleDateFormat sdf;

    @Autowired
    public ArrivalDao(EntityManager em){
        this.em = em;
        this.sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    public List<Arrival> selectArrivals(IngvQuery request){
        Query q = getQuery(request);
        List<Object[]> arrivalsObjects = (List<Object[]>) q.getResultList();
        return parseArObjectMultiCore(arrivalsObjects);
    }

    private Query getQuery(IngvQuery request){
        final String prefix = "select * from arrival a, pick p, station s where a.pick_arrival = p.pick_id and p.station_pick = s.station_id and ";
        String earthquakeId = "a.earthquake_id = ? ";
        String phase = "and a.phase like ?";

        final Query q = em.createNativeQuery(prefix + earthquakeId + phase);

        q.setParameter(1, request.getId());
        q.setParameter(2, request.getPhase() + "%");

        return q;
    }

    private List<Arrival> parseArObjectMultiCore(List<Object[]> arrivalsObjects){
        int step = arrivalsObjects.size()/4;
        List<Arrival> arrival1 = new ArrayList<>(arrivalsObjects.size());
        List<Arrival> arrival2 = new ArrayList<>(step);
        List<Arrival> arrival3 = new ArrayList<>(step);
        List<Arrival> arrival4 = new ArrayList<>(arrivalsObjects.size() - step);

        Thread t1 = new Thread(() -> parseArObject(arrivalsObjects, 0, step, arrival1));
        t1.start();

        Thread t2 = new Thread(() -> parseArObject(arrivalsObjects, step, step * 2, arrival2));
        t2.start();

        Thread t3 = new Thread(() -> parseArObject(arrivalsObjects, step * 2, step * 3, arrival3));
        t3.start();

        Thread t4 = new Thread(() -> parseArObject(arrivalsObjects, step * 3, arrivalsObjects.size(), arrival4));
        t4.start();

        try {
            t1.join();
            t2.join();
            t3.join();
            t4.join();

        }catch (Exception e){
            e.printStackTrace();
        }

        arrival1.addAll(arrival2);
        arrival1.addAll(arrival3);
        arrival1.addAll(arrival4);

        return arrival1;
    }

    private List<Arrival> parseArObject(List<Object[]> arrivalsObject, int head, int end, List<Arrival> arrivals){

        if(arrivals == null){
            arrivals = new ArrayList<>(arrivalsObject.size());
        }

        for(int i = head; i < end; ++i){
            Object[] objects = arrivalsObject.get(i);

            Arrival arrival = new Arrival();
            arrival.setId((int) objects[0]);
            arrival.setPhase((String) objects[1]);

            Earthquake earthquake = new Earthquake((int) objects[2]);

            Pick pick = new Pick();
            pick.setId((int) objects[3]);
            pick.setTime((Date) objects[5]);


            Station station = new Station();
            station.setId((String) objects[7]);
            station.setElevation((float) objects[8]);
            station.setLatitude((float) objects[9]);
            station.setLongitude((float) objects[10]);
            station.setName((String) objects[11]);

            pick.setStation(station);
            arrival.setEarthquake(earthquake);
            arrival.setPick(pick);
            arrivals.add(arrival);
        }
        return arrivals;
    }
}
