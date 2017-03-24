package com.usi.repository;

import com.usi.model.EarthQuake;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EarthquakeRepository extends JpaRepository<EarthQuake, Integer> {

    Optional<EarthQuake> findEarthquakeById(int id);
}
