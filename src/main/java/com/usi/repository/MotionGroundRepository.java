package com.usi.repository;


import com.usi.model.earthquake.MotionGround;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import javax.transaction.Transactional;

@Repository
public interface MotionGroundRepository extends JpaRepository<MotionGround, Integer> {

    Optional<MotionGround> findMotionGroundById(int id);



    @Modifying
    @Transactional
    @Query(value = "delete from motion_ground where intensity_id = ?1", nativeQuery = true)
    void deleteAllByIntensity(long intensity_id);
    }


