package com.usi.model.earthquake;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "amplitude")
public class Amplitude {
    @Id
    @Column(name = "amplitude_id", updatable = false, nullable = false)
    private int id;

    @Column(name = "generic_amplitude")
    private float genericAmplitude;

    @Column(name = "time", nullable = false)
    private Date time;

    @OneToMany(mappedBy = "amplitude")
    private List<StationMagnitude> stationMagnitudes;

    public Amplitude() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float getGenericAmplitude() {
        return genericAmplitude;
    }

    public void setGenericAmplitude(float genericAmplitude) {
        this.genericAmplitude = genericAmplitude;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public List<StationMagnitude> getStationMagnitudes() {
        return stationMagnitudes;
    }

    public void setStationMagnitudes(List<StationMagnitude> stationMagnitudes) {
        this.stationMagnitudes = stationMagnitudes;
    }
}
