package com.usi.model.query;

import com.usi.model.Query;

import java.net.URI;
import java.net.URL;

public class ShakeMapQuery implements Query {

    final String scheme = "http";
    final String authority = "shakemap.rm.ingv.it";
    final String urlPrefix = "/shake/";
    final String urlSuffix = "/download/grid.xml";


    private int earthquakeId;

    public ShakeMapQuery(int earthquakeId){
        this.earthquakeId = earthquakeId;
    }

    public URL generateBaseUrl(){
        URL url = null;
        String path = urlPrefix + earthquakeId + urlSuffix;
        try{
            URI uri = new URI(scheme, authority, path, null);
            url = uri.toURL();
        } catch (Exception e){
            e.printStackTrace();
        }
        return url;
    }



}
