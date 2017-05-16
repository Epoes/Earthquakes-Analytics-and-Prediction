package com.usi.model.earthquake;

import com.usi.model.Query;

import java.net.URI;
import java.net.URL;

public class IscQuery implements Query{

    private String stationCode;

    public IscQuery() {
    }

    public String getStationCode() {
        return stationCode;
    }

    public void setStationCode(String stationCode) {
        this.stationCode = stationCode;
    }

    @Override
    public URL generateBaseUrl() {
        URL url = null;
        String q = "stacode=" + stationCode;
        try {
            URI uri = new URI("http", "www.isc.ac.uk", "/cgi-bin/stations" , q, null);
            url = uri.toURL();

        }catch (Exception e){
            e.printStackTrace();
        }

        return url;
    }
}
