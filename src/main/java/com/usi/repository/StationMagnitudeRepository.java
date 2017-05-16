package com.usi.repository;

import com.usi.model.earthquake.Earthquake;
import com.usi.model.earthquake.StationMagnitude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationMagnitudeRepository extends JpaRepository<StationMagnitude, Integer> {

    Optional<List<StationMagnitude>> getByEarthquakeId(int id);
}
