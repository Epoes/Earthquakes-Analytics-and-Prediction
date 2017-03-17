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

    public ConnectionStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectionStatus status) {
        this.status = status;
    }

    public List getContent() {
        return content;
    }

    public void setContent(List content) {
        this.content = content;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
