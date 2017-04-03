package com.usi.services;

import com.usi.model.earthquake.IngvQuery;
import com.usi.API.twitter.Response;
import com.usi.model.earthquake.Earthquake;

import org.xml.sax.SAXException;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

public interface earthquakeService {

    Response<Earthquake> getEarthQuakes(IngvQuery query)  throws IOException, SAXException, ParserConfigurationException;
}
