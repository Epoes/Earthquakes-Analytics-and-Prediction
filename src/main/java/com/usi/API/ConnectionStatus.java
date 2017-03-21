package com.usi.API;

public enum ConnectionStatus {

    OK(200),
    FORBIDDEN(403),
    ZERO_RESULTS(204),
    UNKNOWN(0),
    OVER_QUERY_LIMIT(1),
    REQUESTDENIED(403),
    BAD_REQUEST(400);

    int status;

    ConnectionStatus(int status){
        this.status = status;
    }

    public static ConnectionStatus getConnectionStatus(int status){
        for(ConnectionStatus connectionStatus : ConnectionStatus.values()){
            if(connectionStatus.status == status){
                return connectionStatus;
            }
        }
        return null;
    }
}
