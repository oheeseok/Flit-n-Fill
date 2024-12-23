package org.example.backend.exceptions;

public class RequestNotFoundException extends RuntimeException{
    public RequestNotFoundException() {
        super();
    }

    public RequestNotFoundException(String message) {
        super(message);
    }
}
