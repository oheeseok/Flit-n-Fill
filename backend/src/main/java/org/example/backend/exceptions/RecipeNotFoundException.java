package org.example.backend.exceptions;

public class RecipeNotFoundException extends RuntimeException{
    public RecipeNotFoundException() {
        super();
    }

    public RecipeNotFoundException(String message) {
        super(message);
    }
}
