package org.example.backend.exceptions;

public class TradeNotCompletedException extends RuntimeException {
    public TradeNotCompletedException(String message) {
        super(message);
    }
}
