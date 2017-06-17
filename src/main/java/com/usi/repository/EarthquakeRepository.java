package com.usi.repository;

import com.usi.model.earthquake.Earthquake;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EarthquakeRepository extends JpaRepository<Earthquake, Integer> {

    Optional<Earthquake> findEarthquakeById(int id);

    @Query(value = "select * from earthquake e, origin o, magnitude m where e.magnitude_earthquake = m.magnitude_id and m.magnitude > ?2 and e.origin_earthquake = o.origin_id order by o.time DESC limit ?1 ", nativeQuery = true)
    Optional<List<Earthquake>> getLastEarthquakes(int count, float magnitude);

    @Query(value = "select earthquake_id from earthquake e, magnitude m where e.magnitude_earthquake = m.magnitude_id and m.magnitude > ?1", nativeQuery = true)
    Optional<List<Integer>> getAllIds(float magnitude);

}
