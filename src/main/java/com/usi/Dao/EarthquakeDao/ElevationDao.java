package com.usi.Dao.EarthquakeDao;

import com.usi.model.Elevation;
import com.usi.model.earthquake.ElevationQuery;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Service
public class ElevationDao {
    private EntityManager em;

    @Autowired
    public ElevationDao(EntityManager em) {
        this.em = em;
    }

    public List<Elevation> selectElevations(ElevationQuery request){
        long startTime = System.currentTimeMillis();
        Query q = getQuery(request);
        List<Object[]> elevationObjectsList = q.getResultList();


        List<Elevation> elevationList = parseElObjectMulticore(elevationObjectsList);
        long endTime = System.currentTimeMillis();
        System.out.println("multi CPU:  "+ elevationObjectsList.size() + " took " + + ((endTime - startTime))+ " milliseconds");
        return elevationList;
    }



    private Query getQuery(ElevationQuery request) {
        final String prefix = "select distinct * from elevation e where ";

        String latitude = "latitude >= ? and latitude <= ? ";
        String longitude =  "and longitude >= ? and longitude <= ? ";
        String elevation = "and elevation >= ? and elevation <= ? ";

        final Query q = em.createNativeQuery(prefix + latitude + longitude + elevation);

        q.setParameter(1, request.getMinLatitude());
        q.setParameter(2, request.getMaxLatitude());

        q.setParameter(3, request.getMinLongitude());
        q.setParameter(4, request.getMaxLongitude());

        q.setParameter(5, request.getMinElevation());
        q.setParameter(6, request.getMaxElevation());

        return q;

    }

    private List<Elevation> parseElObjectSingle(List<Object[]> elevationObjects){
        return parseElObject(elevationObjects, 0, elevationObjects.size(), null);
    }

    private List<Elevation> parseElObjectMulticore(List<Object[]> elevationObjects){
        int step = elevationObjects.size()/4;
        List<Elevation> elevations1 = new ArrayList<>(elevationObjects.size());
        List<Elevation> elevations2 = new ArrayList<>(step);
        List<Elevation> elevations3 = new ArrayList<>(step);
        List<Elevation> elevations4 = new ArrayList<>(elevationObjects.size() - step);

        Thread tr1 = new Thread(() -> parseElObject(elevationObjects, 0, step, elevations1));
        tr1.start();

        Thread tr2 = new Thread(() -> parseElObject(elevationObjects, step, step * 2, elevations2));
        tr2.start();

        Thread tr3 = new Thread(() -> parseElObject(elevationObjects, step * 2, step * 3, elevations3));
        tr3.start();

        Thread tr4 = new Thread(() -> parseElObject(elevationObjects, step * 3, elevationObjects.size(), elevations4));
        tr4.start();

        try{
            tr1.join();
            tr2.join();
            tr3.join();
            tr4.join();

        }catch (Exception e){
            e.printStackTrace();
        }

        elevations1.addAll(elevations2);
        elevations1.addAll(elevations3);
        elevations1.addAll(elevations4);

        return elevations1;
    }
    private List<Elevation> parseElObject(List<Object[]> elevationObjects, int head, int end, List<Elevation> elevations ){

        if(elevations == null) {
            elevations = new ArrayList<>(elevationObjects.size());
        }

        for(int i = head; i< end; i++){

            Object[] objects = elevationObjects.get(i);

            Elevation e = new Elevation((int) objects[0]);
            e.setElevation((int) objects[1]);

            e.setLatitude((double) objects[2]);

            e.setLongitude((double) objects[3]);

            elevations.add(e);
        }

        return elevations;
    }

}
