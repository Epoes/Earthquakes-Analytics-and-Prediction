package com.usi.util.parser;

import com.usi.model.Coordinate;
import com.usi.model.earthquake.Intensity;
import com.usi.model.earthquake.MotionGround;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;


public class ShakeMapParser<T> extends Parser {

    private Coordinate epicenter;

    public Coordinate getEpicenter() {
        return epicenter;
    }

    public void setEpicenter(Coordinate epicenter) {
        this.epicenter = epicenter;
    }

    /*default index for the grid, no guarantee it is and will be fixed */
    private int indexLng = 0;
    private int indexLat = 0;
    private int indexPGA = 0;
    private int indexPGV = 0;
    private int indexMMI = 0;

    private int gridObjectLength = 0;

    private int count = 0;

    public List<Intensity> parseXML(Document xml){
        List<Intensity> intensityList = new ArrayList<>();
        Intensity intensity = new Intensity();
        setId(intensity, xml);
        setGridIndex(xml);

        NodeList eventsList = xml.getElementsByTagName("grid_data");
        String data = eventsList.item(0).getTextContent();
        String[] token = data.split("\n");

        intensity.setMaxIntensity(0.0f);


        for(int i = 1; i < token.length; i++){
            String[] values = token[i].split(" ");
            float MMI = Float.parseFloat(values[indexMMI]);
            float longitude = Float.parseFloat(values[indexLng]);
            float latitude = Float.parseFloat(values[indexLat]);
            float PGA = Float.parseFloat(values[indexPGA]);
            float PGV = Float.parseFloat(values[indexPGV]);
//            double distance = GeographicDistance.haversine(new Coordinate(latitude, longitude), epicenter);

            MotionGround m = new MotionGround(intensity,MMI);
            m.setPga(PGA);
            m.setPgv(PGV);
            m.setLongitude(longitude);
            m.setLatitude(latitude);

            intensity.addMotionGround(m);



            if(MMI > intensity.getMaxIntensity()){

                intensity.setMaxIntensity(MMI);
                intensity.setMaxPga(PGA);
                intensity.setMaxPgv(PGV);
            }


        }

        intensityList.add(intensity);

        return intensityList;
    }

    private void setId(Intensity intensity, Document xml){
        NodeList eventsList = xml.getElementsByTagName("event");
        Node eventNode = eventsList.item(0);
        NamedNodeMap map =  eventNode.getAttributes();
        intensity.setId(Long.parseLong(map.getNamedItem("event_id").getNodeValue()));
    }

    private void setGridIndex(Document xml){
        NodeList gridList = xml.getElementsByTagName("grid_field");
        gridObjectLength = gridList.getLength();
        for(int i = 0; i < gridObjectLength; i++){
            Node node = gridList.item(i);
            String field = node.getAttributes().getNamedItem("name").getNodeValue();

            if(field.equals("LON")){
                indexLng = setIndex(node);
            }else if(field.equals("LAT")){
                indexLat = setIndex(node);
            }else if(field.equals("PGA")){
                indexPGA = setIndex(node);
            }else if(field.equals("PGV")){
                indexPGV = setIndex(node);
            }else if(field.equals("MMI")){
                indexMMI = setIndex(node);
            }
        }
    }

        private int setIndex(Node node){
        return Integer.parseInt(node.getAttributes().getNamedItem("index").getNodeValue()) - 1;
    }

    private Intensity getIntensityGeneralInformation(Node eventNode){



        return null;
    }
}
