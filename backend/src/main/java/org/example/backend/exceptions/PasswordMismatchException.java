package org.example.backend.exceptions;

public class PasswordMismatchException extends IllegalArgumentException {
    public PasswordMismatchException() { super(); }

    public PasswordMismatchException(String message) {
        super(message);
    }
}
