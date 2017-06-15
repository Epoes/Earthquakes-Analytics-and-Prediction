package com.usi;

import com.usi.Dao.EarthquakeDao.StationDao;
import com.usi.model.earthquake.Station;
import com.usi.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@Controller
public class StationController {

    private StationRepository stationRepository;
    private StationDao stationDao;

    @Autowired
    public StationController(StationRepository stationRepository, StationDao stationDao) {
        this.stationRepository = stationRepository;
        this.stationDao = stationDao;
    }


    @RequestMapping(value = "api/stations/query", method = RequestMethod.GET)
    public ResponseEntity<?> getStations(){
        List<Station> stations = this.stationDao.selectAllStations();
        return new ResponseEntity<Object>(stations, HttpStatus.OK);
    }
}
