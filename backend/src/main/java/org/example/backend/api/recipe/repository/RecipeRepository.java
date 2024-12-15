package org.example.backend.api.recipe.repository;

import org.example.backend.api.recipe.model.entity.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
    List<Recipe> findByUserId(Long userId);
}