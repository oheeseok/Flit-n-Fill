package org.example.backend.exceptions;

public class KindnessAlreadyReviewedException extends RuntimeException {
    public KindnessAlreadyReviewedException(String message) {
        super(message);
    }
}
