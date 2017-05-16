package com.usi.repository;

import com.usi.model.Elevation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;

@Repository

public interface ElevationRepository extends JpaRepository<Elevation, Integer> {

}
