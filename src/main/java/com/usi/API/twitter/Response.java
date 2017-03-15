package com.usi.API.twitter;

import com.usi.API.ConnectionStatus;

import java.util.List;


public class Response {
    ConnectionStatus status;
    List content;
    String errorMessage;

    public<T> Response(ConnectionStatus status, List<T> content, String errorMessage){


        this.content = content;
        this.errorMessage = errorMessage;
        this.status = status;
    }

    public Response(ConnectionStatus status){
        this.status = status;
    }

}
