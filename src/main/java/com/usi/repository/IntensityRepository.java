package com.usi.repository;

import com.usi.model.earthquake.Intensity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IntensityRepository extends JpaRepository<Intensity, Integer> {

    Optional<Intensity> findIntensityById(long id);


}
