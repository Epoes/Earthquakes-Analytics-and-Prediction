package com.usi.API.google_maps;


import org.json.JSONArray;
import org.json.JSONObject;

public class Parser {

    private Location location = new Location();

    public Parser() {

    }


    public Location parse(JSONObject jsonObject){
        JSONArray res = jsonObject.getJSONArray("results").getJSONObject(0).getJSONArray("address_components");
        for(int i = 0; i < res.length(); ++i){
            if(this.checkValidity(res, "administrative_area_level_3", i))
                location.setAdminLevel3(res.getJSONObject(i).getString("long_name"));
            if(this.checkValidity(res, "administrative_area_level_2", i))
                location.setAdminLevel2(res.getJSONObject(i).getString("short_name"));
            if(this.checkValidity(res, "administrative_area_level_1", i))
                location.setAdminLevel1(res.getJSONObject(i).getString("long_name"));
            if(this.checkValidity(res, "country", i))
                location.setCountry(res.getJSONObject(i).getString("long_name"));
        }
        return location;
    }

    private boolean checkValidity(JSONArray jsonArray, String level, int index){
        return jsonArray.getJSONObject(index).getJSONArray("types").getString(0).equals(level);
    }
}
