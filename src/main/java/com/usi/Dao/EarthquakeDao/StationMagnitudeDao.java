package com.usi.Dao.EarthquakeDao;

import com.usi.model.earthquake.*;
import com.usi.model.query.IngvQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Query;


@Service
public class StationMagnitudeDao {
    private EntityManager em;
    SimpleDateFormat sdf;

    @Autowired
    public StationMagnitudeDao(EntityManager em){
        this.em = em;
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    public List<StationMagnitude> selectStationMagnitudes(IngvQuery request){
        Query q = getQuery(request);
        List<Object[]> stationMagnitudesObjects = (List<Object[]>) q.getResultList();
        return parseSmObjectMultiCore(stationMagnitudesObjects);
    }

    public Query getQuery(IngvQuery request){
        final String prefix = "select * from station_magnitude s, amplitude a, station st where s.amplitude_station_magnitude = a.amplitude_id and s.station_magnitude_station = st.id_station and ";
        String earthquakeId = "earthquake_id = ? ";
        String magnitude = "and magnitude >= ? and magnitude <= ?;";

        final Query q = em.createNativeQuery(prefix + earthquakeId + magnitude);

        q.setParameter(1, request.getId());
        q.setParameter(2, request.getMinMagnitude());
        q.setParameter(3, request.getMaxMagnitude());

        return q;
    }

    private List<StationMagnitude> parseSmObjectMultiCore(List<Object[]> stationMagnitudesObjects){
        int step = stationMagnitudesObjects.size()/4;
        List<StationMagnitude> stationMagnitudes1 = new ArrayList<>(stationMagnitudesObjects.size());
        List<StationMagnitude> stationMagnitudes2 = new ArrayList<>(step);
        List<StationMagnitude> stationMagnitudes3 = new ArrayList<>(step);
        List<StationMagnitude> stationMagnitudes4 = new ArrayList<>(stationMagnitudesObjects.size() - step);

        Thread t1 = new Thread(() -> parseSmObject(stationMagnitudesObjects, 0, step, stationMagnitudes1));
        t1.start();

        Thread t2 = new Thread(() -> parseSmObject(stationMagnitudesObjects, step, step*2, stationMagnitudes2));
        t2.start();

        Thread t3 = new Thread(() -> parseSmObject(stationMagnitudesObjects, step*2, step*3, stationMagnitudes3));
        t3.start();

        Thread t4 = new Thread(() -> parseSmObject(stationMagnitudesObjects,  step*3, stationMagnitudesObjects.size(), stationMagnitudes4));
        t4.start();

        try {
            t1.join();
            t2.join();
            t3.join();
            t4.join();

        }catch (Exception e){
            e.printStackTrace();
        }

        stationMagnitudes1.addAll(stationMagnitudes2);
        stationMagnitudes1.addAll(stationMagnitudes3);
        stationMagnitudes1.addAll(stationMagnitudes4);

        return stationMagnitudes1;
    }

    private List<StationMagnitude> parseSmObject(List<Object[]> stationMagnitudesObjects, int head, int end, List<StationMagnitude> stationMagnitudes){

        if(stationMagnitudes == null){
            stationMagnitudes = new ArrayList<>(stationMagnitudesObjects.size());
        }

        for(int i = head; i < end; ++i){
            Object[] objects = stationMagnitudesObjects.get(i);

            StationMagnitude stationMagnitude = new StationMagnitude();
            stationMagnitude.setId((int) objects[0]);
            stationMagnitude.setMagnitude((float) objects[1]);
            stationMagnitude.setType((String) objects[2]);

            Amplitude amplitude = new Amplitude();
            amplitude.setId((int) objects[3]);
            amplitude.setGenericAmplitude((float) objects[7]);
            amplitude.setTime((Date) objects[8]);

            Earthquake earthquake = new Earthquake((int) objects[4]);

            Station station = new Station();
            station.setId((String) objects[5]);
            station.setElevation((float) objects[10]);
            station.setLatitude((float) objects[11]);
            station.setLongitude((float) objects[12]);
            station.setName((String) objects[13]);

            stationMagnitude.setAmplitude(amplitude);
            stationMagnitude.setEarthquake(earthquake);
            stationMagnitude.setStation(station);
            stationMagnitudes.add(stationMagnitude);
        }
        return stationMagnitudes;
    }
}
