package com.usi.model.earthquake;


import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "earthquake")
public class Earthquake {
    @Id
    @Column(name = "earthquake_id", updatable = false, nullable = false)
    private int id;

    @OneToOne(fetch= FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name="origin_earthquake")
    Origin origin;

    @OneToOne(fetch= FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name="magnitude_earthquake")
    Magnitude magnitude;

    @Column(name = "regionName", nullable = false, length = 255)
    String regionName;


//    private Location location;





    public Earthquake(int id){
        this.id = id;
    }

    public Earthquake(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Origin getOrigin() {
        return origin;
    }

    public void setOrigin(Origin origin) {
        this.origin = origin;
    }

    public Magnitude getMagnitude() {
        return magnitude;
    }

    public void setMagnitude(Magnitude magnitude) {
        this.magnitude = magnitude;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

//    public Location getLocation() {
//        return location;
//    }
//
//    public void setLocation(Location location) {
//        this.location = location;
//    }

    @Override
    public String toString() {
        return "Earthquake{" +
                "id=" + id +
                ", origin=" + origin +
                ", magnitude=" + magnitude +
                ", regionName='" + regionName + '\'' +
//                ", location=" + location +
                '}';
    }
}
