package com.usi.repository;

import com.usi.model.EarthQuake;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface EarthquakeRepository extends JpaRepository<EarthQuake, Integer> {

    Optional<EarthQuake> findEarthquakeById(int id);
}
