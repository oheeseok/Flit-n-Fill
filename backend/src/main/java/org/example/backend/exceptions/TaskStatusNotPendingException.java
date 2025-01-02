package org.example.backend.exceptions;

public class TaskStatusNotPendingException extends RuntimeException {
    public TaskStatusNotPendingException(String message) {
        super(message);
    }
}
