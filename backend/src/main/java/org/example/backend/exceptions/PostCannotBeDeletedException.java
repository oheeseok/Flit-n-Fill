package org.example.backend.exceptions;

public class PostCannotBeDeletedException extends RuntimeException {
  public PostCannotBeDeletedException(String message) {
    super(message);
  }
}
