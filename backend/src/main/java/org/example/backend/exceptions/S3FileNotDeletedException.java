package org.example.backend.exceptions;

public class S3FileNotDeletedException extends RuntimeException {
  public S3FileNotDeletedException(String message) {
    super(message);
  }
}
