package org.example.backend.exceptions;

public class TradeNotFoundException extends RuntimeException {
    public TradeNotFoundException(String message) {
        super(message);
    }
}
