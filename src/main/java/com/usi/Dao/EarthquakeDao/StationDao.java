package com.usi.Dao.EarthquakeDao;

import com.usi.model.earthquake.Earthquake;
import com.usi.model.earthquake.Station;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

@Service
public class StationDao {

    private EntityManager em;

    @Autowired
    public StationDao(EntityManager em){
        this.em = em;
    }

    public List<Station> selectAllStations(){
        Query q = getQuery();
        List<Object[]> stationObjects = (List<Object[]>) q.getResultList();
        return parseObjectSingle(stationObjects);
    }

    private Query getQuery(){
        final String query = "select * from station where station_name != 'null'";

        final Query q = this.em.createNativeQuery(query);

        return q;
    }

    private List<Station> parseObjectSingle(List<Object[]> stationObjects){
        return parseObject(stationObjects, 0, stationObjects.size(), null);
    }

    private List<Station> parseObject(List<Object[]> stationObjects, int head, int end, List<Station> stations ){
        if(stations == null){
            stations = new ArrayList<>(stationObjects.size());
        }

        for(int i = head; i < end; ++i){
            Object[] objects = stationObjects.get(i);

            Station station = new Station();

            station.setElevation((float) objects[1]);
            station.setLatitude((float) objects[2]);
            station.setLongitude((float) objects[3]);
            station.setName((String) objects[4]);

            stations.add(station);
        }
        return stations;
    }
}
