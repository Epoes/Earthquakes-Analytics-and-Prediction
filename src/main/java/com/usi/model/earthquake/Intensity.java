package com.usi.model.earthquake;


import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "intensity")
public class Intensity {
    @Id
    @Column(name = "intensity_id", updatable = false, nullable = false)
    private long id;

    /* instrumental intensity */
    @Column(name = "max_intensity", nullable = false)
    @JsonIgnore
    private float maxIntensity;

    /* peak ground acceleration (percent-g) */
    @Column(name = "max_pga", nullable = false)
    @JsonIgnore
    private float maxPga;

    /* peak ground velocity (cm/s) */
    @Column(name = "max_pgv", nullable = false)
    @JsonIgnore
    private float maxPgv;

//    @OneToMany(fetch = FetchType.EAGER, mappedBy = "intensity")
    @Transient
    @JsonIgnore
    private List<List<Float>> motionGroundGrid = new ArrayList<>();


    @OneToOne(fetch = FetchType.LAZY, mappedBy="intensity")
    @JsonIgnore
    private Earthquake earthquake;

    @JsonIgnore
    public List<List<Float>> getMotionGroundGrid() {
        return motionGroundGrid;
    }

    public void addMotionGround(MotionGround m){
        List<Float> motionGround = new ArrayList<>(Arrays.asList(m.getLatitude(), m.getLongitude(), m.getMMIntensity(), m.getPga(), m.getPgv()));
        motionGroundGrid.add(motionGround);
    }

    public void setMotionGroundGrid(List<List<Float>> motionGroundGrid) {
        this.motionGroundGrid = motionGroundGrid;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public float getMaxIntensity() {
        return maxIntensity;
    }

    public void setMaxIntensity(float maxIntensity) {
        this.maxIntensity = maxIntensity;
    }

    public float getMaxPga() {
        return maxPga;
    }

    public void setMaxPga(float maxPga) {
        this.maxPga = maxPga;
    }

    public float getMaxPgv() {
        return maxPgv;
    }

    public void setMaxPgv(float maxPgv) {
        this.maxPgv = maxPgv;
    }




    public Earthquake getEarthquake() {
        return earthquake;
    }

    public void setEarthquake(Earthquake earthquake) {
        this.earthquake = earthquake;
    }

}
