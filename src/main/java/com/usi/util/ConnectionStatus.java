package com.usi.util;

public enum ConnectionStatus {

    OK(200),
    FORBIDDEN(403),
    ZERO_RESULTS(204),
    UNKNOWN(0),
    OVER_QUERY_LIMIT(1),
    BAD_REQUEST(400),
    SERVER_ERROR(500);

    int status;

    ConnectionStatus(int status){
        this.status = status;
    }

    public static ConnectionStatus getConnectionStatus(int status){

        if(status >= 500){
            return SERVER_ERROR;
        }

        for(ConnectionStatus connectionStatus : ConnectionStatus.values()){
            if(connectionStatus.status == status){
                return connectionStatus;
            }
        }
        return UNKNOWN;
    }
}
