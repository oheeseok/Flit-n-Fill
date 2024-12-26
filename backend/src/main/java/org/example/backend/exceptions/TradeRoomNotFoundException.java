package org.example.backend.exceptions;

public class TradeRoomNotFoundException extends RuntimeException {
    public TradeRoomNotFoundException(String message) {
        super(message);
    }
}
