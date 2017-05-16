package com.usi.util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class HtmlParser {

    private String url;

    public HtmlParser(String url){
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Map<String, String> parsePage() throws IOException {

        Document doc =  Jsoup.connect(url).get();
        String pre = doc.select("pre").text();
        Map<String, String> map = new HashMap<>();
        map.put("stationCode", pre.split("\n")[3].split(": ")[1]);
        map.put("zone", pre.split("\n")[13].split(": ")[1]);
        map.put("latitude", pre.split("\n")[5].split(": ")[1].trim());
        map.put("longitude", pre.split("\n")[7].split(": ")[1].trim());
        map.put("elevation", pre.split("\n")[9].split(": ")[1].trim());

        return map;
    }
}
