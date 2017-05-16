package com.usi;

import com.usi.model.Elevation;
import com.usi.model.earthquake.ElevationQuery;
import com.usi.repository.EarthquakeRepository;
import com.usi.repository.ElevationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import com.usi.Dao.EarthquakeDao.ElevationDao;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;


@Controller
public class ElevationsController {
    private ElevationRepository elevationRepository;
    private ElevationDao elevationDao;

    @Autowired
    public ElevationsController(ElevationRepository elevationRepository, ElevationDao elevationDao) {
        this.elevationRepository = elevationRepository;
        this.elevationDao = elevationDao;
    }

    @RequestMapping(value = "api/elevations/query", method = RequestMethod.GET)
    public ResponseEntity<?> getElevations(@RequestParam(value = "minlat",required = false) Optional<Double> minLatitude,
                                           @RequestParam(value = "maxlat",required = false) Optional<Double> maxLatitude,
                                           @RequestParam(value = "minlon",required = false) Optional<Double> minLongitude,
                                           @RequestParam(value = "maxlon",required = false) Optional<Double> maxLongitude,
                                           @RequestParam(value = "minele",required = false) Optional<Integer> minElevation,
                                           @RequestParam(value = "maxele",required = false) Optional<Integer> maxElevation){

        ElevationQuery query = new ElevationQuery();

        minLatitude.ifPresent(value -> query.setMinLatitude(value));
        maxLatitude.ifPresent(value -> query.setMaxLatitude(value));
        minLongitude.ifPresent(value -> query.setMinLongitude(value));
        maxLongitude.ifPresent(value -> query.setMaxLongitude(value));
        minElevation.ifPresent(value -> query.setMinElevation(value));
        maxElevation.ifPresent(value -> query.setMaxElevation(value));

        List<Elevation> elevationList = elevationDao.selectElevations(query);
        return new ResponseEntity<Object>(elevationList, HttpStatus.OK);
    }
}
