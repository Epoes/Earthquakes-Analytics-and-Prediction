package com.usi.services.earthquake;


import com.usi.util.Response;
import com.usi.model.Query;
import com.usi.model.earthquake.Earthquake;
import com.usi.model.earthquake.Intensity;
import com.usi.services.earthquakeService;
import com.usi.util.ConnectionStatus;
import com.usi.util.SimpleHttpRequest;
import com.usi.util.parser.Parser;

import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;

@Service
public class EarthquakeServiceImpl implements earthquakeService {

    public Response<Earthquake> requestEarthquakes(Parser<Earthquake> parser, Query query) throws IOException, SAXException, ParserConfigurationException {
        URL url = query.generateBaseUrl();
        HttpResponse httpResponse;
        httpResponse = SimpleHttpRequest.get(url);
        int status = httpResponse.getStatusLine().getStatusCode();
        if (status != 200) {
            return new Response<>(ConnectionStatus.getConnectionStatus(status), null, httpResponse.getStatusLine().getReasonPhrase() +
            " With query: " + url);
        }

        String body = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
        Document xmlDoc = parser.parseXMLBody(body);
        List<Earthquake> earthquakes =  parser.parseXML(xmlDoc);

        return new Response<Earthquake>(ConnectionStatus.OK, earthquakes, null);

    }


    public Intensity requestIntensity(Parser<Intensity> parser, Query query, Earthquake earthquake)throws IOException, SAXException, ParserConfigurationException{

        URL url = query.generateBaseUrl();
        HttpResponse httpResponse;
        httpResponse = SimpleHttpRequest.get(url);
        int status = httpResponse.getStatusLine().getStatusCode();

        if (status != 200) {
            return null;
        }

        String body = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
        Document xmlDoc = parser.parseXMLBody(body);


        Intensity intensity =  parser.parseXML(xmlDoc).get(0);
        intensity.setEarthquake(earthquake);

        return intensity;
    }
}