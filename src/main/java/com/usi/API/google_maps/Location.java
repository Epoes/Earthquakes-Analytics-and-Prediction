package com.usi.API.google_maps;

public class Location {

    private String adminLevel3;
    private String adminLevel2;
    private String adminLevel1;
    private String country;

    public Location(String adminLevel3, String adminLevel2, String adminLevel1, String country) {
        this.adminLevel3 = adminLevel3;
        this.adminLevel2 = adminLevel2;
        this.adminLevel1 = adminLevel1;
        this.country = country;
    }

    public Location(){}

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
