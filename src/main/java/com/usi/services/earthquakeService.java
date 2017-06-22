package com.usi.services;

import com.usi.util.Response;
import com.usi.model.Query;
import com.usi.model.earthquake.Earthquake;
import com.usi.model.earthquake.Intensity;
import com.usi.util.parser.Parser;

import org.xml.sax.SAXException;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

public interface earthquakeService {

    Response<Earthquake> requestEarthquakes(Parser<Earthquake> parser, Query query)  throws IOException, SAXException, ParserConfigurationException;

    Intensity requestIntensity(Parser<Intensity> parser, Query query, Earthquake earthquake) throws IOException, SAXException, ParserConfigurationException;

    }
