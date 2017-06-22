package com.usi.util;

import java.util.List;


public class Response <E> {
    ConnectionStatus status;
    List<E> content;
    String errorMessage;

    public Response(ConnectionStatus status, List<E> content, String errorMessage){
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

    public boolean isValid(){
        if (status == ConnectionStatus.OK){
            return true;
        }
        return false;
    }
}
