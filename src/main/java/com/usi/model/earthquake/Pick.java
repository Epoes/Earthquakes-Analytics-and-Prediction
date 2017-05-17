package com.usi.model.earthquake;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "pick")
public class Pick {

    @Id
    @Column(name = "pick_id", updatable = false, nullable = false)
    private int id;

    @Column(name = "time", nullable = false)
    private Date time;

    @OneToMany(mappedBy="pick")
    private List<Arrival> arrivals;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "station_pick")
    Station station;

    public Pick() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public List<Arrival> getArrivals() {
        return arrivals;
    }

    public void setArrivals(List<Arrival> arrivals) {
        this.arrivals = arrivals;
    }

    public Station getStation() {
        return station;
    }

    public void setStation(Station station) {
        this.station = station;
    }
}
