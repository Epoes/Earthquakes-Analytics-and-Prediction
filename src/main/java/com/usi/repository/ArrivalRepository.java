package com.usi.repository;

import com.usi.model.earthquake.Arrival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArrivalRepository extends JpaRepository<Arrival, Integer>{
    Optional<List<Arrival>> getByEarthquakeId(int id);
}
