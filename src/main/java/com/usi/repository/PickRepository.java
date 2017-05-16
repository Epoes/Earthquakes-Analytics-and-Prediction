package com.usi.repository;

import com.usi.model.earthquake.Pick;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PickRepository extends JpaRepository<Pick, Integer>{
}
