package com.usi.repository;

import com.usi.model.EarthQuake;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EarthquakeRepository extends JpaRepository<EarthQuake, Integer> {

    Optional<EarthQuake> findEarthquakeById(int id);

    @Query(value = "select * from earthquake e, magnitude m where e.magnitude_earthquake = m.id and m.magnitude > ?2 limit ?1", nativeQuery = true)
    Optional<List<EarthQuake>> getLastEarthquakes(int count, float magnitude);


}
