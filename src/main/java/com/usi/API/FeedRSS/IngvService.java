package com.usi.API.FeedRSS;


import com.usi.API.ConnectionStatus;
import com.usi.API.twitter.Response;
import com.usi.model.Earthquake;
import com.usi.model.Magnitude;
import com.usi.model.Origin;

import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

@Service
public class IngvService implements RssService {

    @Autowired
    IngvSimpleHttpRequest simpleHttpRequest;

    SimpleDateFormat sdf;


    public IngvService(){
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS z");
    }


    public Response<Earthquake> getEarthQuakes(IngvQuery query) throws IOException, SAXException, ParserConfigurationException {
        URL url = query.generateUrlForMultipleEq();
        HttpResponse httpResponse;

        httpResponse = simpleHttpRequest.get(url);

        int status = httpResponse.getStatusLine().getStatusCode();
        if (status != 200) {
            return new Response<>(ConnectionStatus.getConnectionStatus(status), null, httpResponse.getStatusLine().getReasonPhrase() +
            " With query: " + url);
        }

        String body = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
        Document xmlDoc = parseBody(body);
        List<Earthquake> earthquakes =  parseXml(xmlDoc);

        return new Response<>(ConnectionStatus.OK, earthquakes, null);

    }

    private List<Earthquake> parseXml(Document doc) {

        List<Earthquake> earthquakes = new ArrayList<>();
        NodeList eventsList = doc.getElementsByTagName("event");
            for (int i = 0; i < eventsList.getLength(); i++) {
                Node eventNode = eventsList.item(i);
                if (eventNode.getNodeType() == Node.ELEMENT_NODE) {

                    Element eventElement = (Element) eventNode;
                    int id = getIdFromLink(eventElement.getAttribute("publicID"));
                    if(id == 0){
                        System.err.println("unable to get the id from: " + eventElement.getAttribute("publicID"));
                        continue;
                    }

                    Earthquake earthquake = new Earthquake(id);
                    earthquake.setRegionName(getRegionName(eventElement));
                    try {
                        earthquake.setOrigin(getOrigin(eventElement));
                        earthquake.getOrigin().setEarthquake(earthquake);
                    }catch (java.text.ParseException e){
                        e.printStackTrace();
                        continue;
                    }

                    earthquake.setMagnitude(getMagnitude(eventElement));
                    earthquakes.add(earthquake);
                }
            }
        return earthquakes;
    }

    private Magnitude getMagnitude(Element eventElement) {
        NodeList nodeList = eventElement.getElementsByTagName("magnitude");
        Element magnitudeElement = (Element) nodeList.item(0);

        Magnitude magnitude = new Magnitude(getIdFromLink(magnitudeElement.getAttribute("publicID")));
        magnitude.setType(magnitudeElement.getElementsByTagName("type").item(0).getTextContent());
        magnitude.setMagnitude(Float.parseFloat(getValue(magnitudeElement, "mag", "value")));

        try {
            magnitude.setUncertainty(Float.parseFloat(getValue(magnitudeElement, "mag", "uncertainty")));
        }catch (NullPointerException e){
            magnitude.setUncertainty(0.0f);
        }
        return magnitude;


    }


    private Origin getOrigin(Element eventElement) throws java.text.ParseException {
        NodeList nodeList = eventElement.getElementsByTagName("origin");
        Element originElement = (Element) nodeList.item(0);
        Origin origin = new Origin(getIdFromLink(originElement.getAttribute("publicID")));

        //time
        String time  = getValue(originElement, "time", "value");
        time = time.replace("T", " ");
        time = time.substring(0, time.length() - 3);
        time += " UTC";
        Date date = sdf.parse(time);
        origin.setTime(date);
        origin.setLatitude(Float.parseFloat(getValue(originElement, "latitude", "value")));
        origin.setLongitude(Float.parseFloat(getValue(originElement, "longitude", "value")));
        origin.setDepth(Integer.parseInt(getValue(originElement, "depth", "value")));


        return origin;
    }

    private String getValue(Element element, String tagName, String value){

        Element elementTag = (Element) element.getElementsByTagName(tagName).item(0);
        return elementTag.getElementsByTagName(value).item(0).getTextContent();

    }

    private String getRegionName(Element eventElement) {
        Element description =  (Element) eventElement.getElementsByTagName("description").item(0);
        return description.getElementsByTagName("text").item(0).getTextContent();
    }

    private int getIdFromLink(String publicID) {
        String stringId = publicID.split("=")[1];
        try{
            return Integer.parseInt(stringId);
        }catch (NumberFormatException e){
            return 0;
        }

    }

    private Document parseBody(String input) throws IOException, SAXException, ParserConfigurationException{
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();

        Document doc = builder.parse(new InputSource(new StringReader(input)));
        doc.getDocumentElement().normalize();

        return doc;
    }






}