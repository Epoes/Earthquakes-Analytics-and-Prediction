package com.usi.API.FeedRSS;

import com.usi.API.twitter.Response;
import com.usi.model.Earthquake;

import org.xml.sax.SAXException;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

public interface RssService {

    Response<Earthquake> getEarthQuakes(IngvQuery query)  throws IOException, SAXException, ParserConfigurationException;
}
