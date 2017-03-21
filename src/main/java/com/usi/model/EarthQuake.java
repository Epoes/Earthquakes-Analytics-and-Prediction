package com.usi.model;


//@Entity
//@Table(name = "earthquake")
public class EarthQuake {
//    @Id
//    @Column(name = "id", updatable = false, nullable = false)
    private int id;
    Origin origin;
    Magnitude magnitude;
    String regionName;
    private Location location;





    public EarthQuake(int id){
        this.id = id;
    }

    public EarthQuake(){}

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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    @Override
    public String toString() {
        return "EarthQuake{" +
                "id=" + id +
                ", origin=" + origin +
                ", magnitude=" + magnitude +
                ", regionName='" + regionName + '\'' +
                ", location=" + location +
                '}';
    }
}
