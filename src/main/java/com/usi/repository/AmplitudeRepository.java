package com.usi.repository;


import com.usi.model.earthquake.Amplitude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmplitudeRepository extends JpaRepository<Amplitude, Integer>{

}
