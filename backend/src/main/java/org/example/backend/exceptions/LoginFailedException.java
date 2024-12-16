package org.example.backend.exceptions;

public class LoginFailedException extends IllegalArgumentException {
    public LoginFailedException() {
        super();
    }

    public LoginFailedException(String message) {
        super(message);
    }
}
