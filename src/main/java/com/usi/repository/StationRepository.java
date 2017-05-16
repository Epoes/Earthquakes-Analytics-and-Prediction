package com.usi.repository;

import com.usi.model.earthquake.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Integer> {

    Optional<Station> getById(String id);
}
