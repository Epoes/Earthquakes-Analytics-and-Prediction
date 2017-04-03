package com.usi.repository;

import com.usi.model.earthquake.Origin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.Optional;

public interface OriginRepository extends JpaRepository<Origin, Integer> {

    @Query(value = "select  max(time) from origin", nativeQuery = true)
    Optional<Date> getMaxDate();

    @Query(value = "select  min(time) from origin", nativeQuery = true)
    Optional<Date> getMinDate();
}
