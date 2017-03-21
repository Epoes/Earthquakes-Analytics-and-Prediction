package com.usi.API.FeedRSS;


import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;


//simple request: no header options
public class IngvSimpleHttpRequest {


    public HttpResponse get(URL url) throws IOException {
        HttpClient client = HttpClientBuilder.create().build();
        HttpGet request = new HttpGet(url.toString());

        HttpResponse response = client.execute(request);

        System.out.println("Response Code : "
                + response.getStatusLine().getStatusCode());

        return response;

    }


    private String parseInputStream(InputStream inputStream) throws IOException  {
        BufferedReader in = new BufferedReader(
                new InputStreamReader(inputStream));
        String inputLine;
        StringBuffer body = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            body.append(inputLine);
        }
        in.close();
        return body.toString();



    }


}
