package com.usi.model.earthquake;

import javax.persistence.*;

@Entity
@Table(name = "arrival")
public class Arrival {

    @Id
    @Column(name = "arrival_id", updatable = false, nullable = false)
    private int id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "earthquake_id")
    private Earthquake earthquake;

    @Column(name = "phase")
    private String phase;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "pick_arrival")
    Pick pick;

    public Arrival() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Earthquake getEarthquake() {
        return earthquake;
    }

    public void setEarthquake(Earthquake earthquake) {
        this.earthquake = earthquake;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public Pick getPick() {
        return pick;
    }

    public void setPick(Pick pick) {
        this.pick = pick;
    }
}
