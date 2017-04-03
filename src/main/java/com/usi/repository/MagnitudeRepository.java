package com.usi.repository;


import com.usi.model.earthquake.Magnitude;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MagnitudeRepository extends JpaRepository<Magnitude, Integer> {


}
