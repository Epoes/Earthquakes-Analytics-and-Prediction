package com.usi.services.earthquake;

import com.usi.util.Response;
import com.usi.model.earthquake.*;
import com.usi.model.query.IngvQuery;
import com.usi.repository.StationRepository;
import com.usi.util.ConnectionStatus;
import com.usi.util.HtmlParser;
import com.usi.util.SimpleHttpRequest;
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

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class EarthquakeAdditionalInfoServiceImpl {

    private SimpleDateFormat sdf;
    private HtmlParser htmlParser;
    private StationRepository stationRepository;
    private Document body;

    IscQuery iscQuery;
    @Autowired
    public EarthquakeAdditionalInfoServiceImpl(StationRepository stationRepository) {
        sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS z");
        iscQuery = new IscQuery();
        this.stationRepository = stationRepository;
    }

    public void generateXml(IngvQuery query) throws IOException, SAXException, ParserConfigurationException {
        URL url = query.generateUrlById();
        HttpResponse httpResponse;

        httpResponse = SimpleHttpRequest.get(url);

        int status = httpResponse.getStatusLine().getStatusCode();
        if (status != 200) {
            System.out.println(httpResponse.getStatusLine().getReasonPhrase() +
                    " With query: " + url);
            return;
        }

        String body = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
        this.body = parseBody(body);
    }

    public Response<StationMagnitude> getStationMagnitudes(){

        List<StationMagnitude> stationMagnitudeList =  parseXmlStationMagnitude();

        return new Response<>(ConnectionStatus.OK, stationMagnitudeList, null);
    }

    public Response<Arrival> getArrivals(){

        List<Arrival> arrivalList =  parseXmlArrivals();

        return new Response<>(ConnectionStatus.OK, arrivalList, null);
    }

    private List<Arrival> parseXmlArrivals(){
        List<Arrival> arrivalList = new ArrayList<>();
        NodeList arrivals = this.body.getElementsByTagName("arrival");
        NodeList picks = this.body.getElementsByTagName("pick");
        for(int i = 0; i < arrivals.getLength(); ++i){
            Node arrivalNode = arrivals.item(i);
            if(arrivalNode.getNodeType() == Node.ELEMENT_NODE){
                Element arrivalElement = (Element) arrivalNode;
                int id = getIdFromLink(arrivalElement.getAttribute("publicID"), "=");
                if(id == 0){
                    System.err.println("unable to get the id from: " + arrivalElement.getAttribute("publicID"));
                    continue;
                }
                Arrival arrival = new Arrival();
                arrival.setId(id);
                arrival.setPhase(getPhase(arrivalElement));
                String pickId = getTag(arrivalElement, "pickID");
                Element pickElement = searchForId(picks, pickId);
                try{
                    arrival.setPick(getPick(pickElement));
                } catch (Exception e){
//                    e.printStackTrace();
                    continue;
                }
                arrivalList.add(arrival);
            }
        }
        return arrivalList;
    }

    private String getPhase(Element arrivalElement){
        return arrivalElement.getElementsByTagName("phase").item(0).getTextContent();
    }

    private Pick getPick(Element pickElement) throws java.text.ParseException{
        Pick pick = new Pick();
        pick.setId(getIdFromLink(pickElement.getAttribute("publicID"), "="));
        String time = getValue(pickElement, "time", "value");
        time = time.replace("T", " ");
        time += " UTC";
        Date date = sdf.parse(time);
        pick.setTime(date);
        try {
            pick.setStation(getStation(pickElement));
        } catch (Exception e){
//            e.printStackTrace();
        }
        return pick;
    }

    private List<StationMagnitude> parseXmlStationMagnitude() {
        List<StationMagnitude> stationMagnitudeList = new ArrayList<>();
        NodeList magnitudeList = this.body.getElementsByTagName("stationMagnitude");
        NodeList amplitudeList = this.body.getElementsByTagName("amplitude");
        for (int i = 0; i < magnitudeList.getLength(); ++i){
            Node magnitudeNode = magnitudeList.item(i);
            if (magnitudeNode.getNodeType() == Node.ELEMENT_NODE) {
                Element magnitudeElement = (Element) magnitudeNode;
                int id = getIdFromLink(magnitudeElement.getAttribute("publicID"), "-");
                if(id == 0){
                    System.err.println("unable to get the id from: " + magnitudeElement.getAttribute("publicID"));
                    continue;
                }
                StationMagnitude stationMagnitude = new StationMagnitude();
                stationMagnitude.setId(id);
                stationMagnitude.setMagnitude(Float.parseFloat(getValue(magnitudeElement, "mag", "value")));
                stationMagnitude.setType(getTag(magnitudeElement, "type"));
                String amplitudeId = getTag(magnitudeElement, "amplitudeID");
                Element amplitudeElement = searchForId(amplitudeList, amplitudeId);
                try {
                    stationMagnitude.setAmplitude(getAmplitude(amplitudeElement));
                    stationMagnitude.setStation(getStation(magnitudeElement));
                } catch (Exception e){
//                    e.printStackTrace();
                    continue;
                }
                stationMagnitudeList.add(stationMagnitude);
            }
        }
        return stationMagnitudeList;
    }

    private Station getStation(Element magnitudeElement) throws IOException{
        Element waveformElement = (Element) magnitudeElement.getElementsByTagName("waveformID").item(0);
        String stationCode = waveformElement.getAttribute("stationCode");
        Station station = this.stationRepository.getById(stationCode).orElse(null);
        if(station == null) {
            iscQuery.setStationCode(stationCode);
            htmlParser = new HtmlParser(iscQuery.generateBaseUrl().toString());
            try {
                Map<String, String> stationInfos = htmlParser.parsePage();
                station = new Station();
                station.setId(stationInfos.get("stationCode"));
                station.setLatitude(Float.parseFloat(stationInfos.get("latitude")));
                station.setLongitude(Float.parseFloat(stationInfos.get("longitude")));
                station.setElevation(Float.parseFloat(stationInfos.get("elevation")));
                station.setName(stationInfos.get("zone"));
            } catch (Exception e){
//                e.printStackTrace();
                station = new Station();
                station.setId(stationCode);
            }

        }
        return station;
    }

    private Amplitude getAmplitude(Element amplitudeElement) throws java.text.ParseException{
        Amplitude amplitude = new Amplitude();
        amplitude.setId(getIdFromLink(amplitudeElement.getAttribute("publicID"), "-"));
        amplitude.setGenericAmplitude(Float.parseFloat(getValue(amplitudeElement, "genericAmplitude", "value")));
        String time = getValue(amplitudeElement, "timeWindow", "reference");
        time = time.replace("T", " ");
        time += " UTC";
        Date date = sdf.parse(time);
        amplitude.setTime(date);
        return amplitude;
    }

    private Element searchForId(NodeList list, String id){
        for(int i = 0; i < list.getLength(); ++i){
            Node listNode = list.item(i);
            if (listNode.getNodeType() == Node.ELEMENT_NODE) {
                Element listElement = (Element) listNode;
                if (listElement.getAttribute("publicID").equals(id)) {
                    return listElement;
                }
            }
        }
        return null;
    }

    private Document parseBody(String input) throws IOException, SAXException, ParserConfigurationException{
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();

        Document doc = builder.parse(new InputSource(new StringReader(input)));
        doc.getDocumentElement().normalize();

        return doc;
    }

    private int getIdFromLink(String publicId, String delimiter){
        String id = publicId.split(delimiter)[1];
        try {
            return Integer.parseInt(id);
        } catch (NumberFormatException e){
            return 0;
        }
    }

    private String getValue(Element element, String tagName, String value){
        Element elementTag = (Element) element.getElementsByTagName(tagName).item(0);
        return elementTag.getElementsByTagName(value).item(0).getTextContent();
    }

    private String getTag(Element element, String tagName){
        return element.getElementsByTagName(tagName).item(0).getTextContent();
    }



}
