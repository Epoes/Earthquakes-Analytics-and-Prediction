package com.usi.model;

//@Entity
//@Table(name = "location")
public class Location {


//    @Column(name = "adminLevel3", nullable = false, length = 255)
    private String adminLevel3;
//    @Column(name = "adminLevel2", nullable = false, length = 255)
    private String adminLevel2;
//    @Column(name = "adminLevel1", nullable = false, length = 255)
    private String adminLevel1;
//    @Column(name = "country", nullable = false, length = 255)
    private String country;

    public Location(String adminLevel3, String adminLevel2, String adminLevel1, String country) {
        this.adminLevel3 = adminLevel3;
        this.adminLevel2 = adminLevel2;
        this.adminLevel1 = adminLevel1;
        this.country = country;
    }

    public Location(){}

    @Override
    public String toString() {
        return "Location{" +
                "adminLevel3='" + adminLevel3 + '\'' +
                ", adminLevel2='" + adminLevel2 + '\'' +
                ", adminLevel1='" + adminLevel1 + '\'' +
                ", country='" + country + '\'' +
                '}';
    }

    public String getAdminLevel3() {
        return adminLevel3;
    }

    public void setAdminLevel3(String adminLevel3) {
        this.adminLevel3 = adminLevel3;
    }

    public String getAdminLevel2() {
        return adminLevel2;
    }

    public void setAdminLevel2(String adminLevel2) {
        this.adminLevel2 = adminLevel2;
    }

    public String getAdminLevel1() {
        return adminLevel1;
    }

    public void setAdminLevel1(String adminLevel1) {
        this.adminLevel1 = adminLevel1;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
