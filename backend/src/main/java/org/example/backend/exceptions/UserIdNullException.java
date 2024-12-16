package org.example.backend.exceptions;

public class UserIdNullException extends RuntimeException {
    public UserIdNullException() {
        super();
    }

    public UserIdNullException(String message) {
        super(message);
    }
}