package org.example.backend.exceptions;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException() {
        super();
    }

    public PostNotFoundException(String message) {
        super(message);
    }
}
