package org.example.backend.domain.recipe.controller;

import org.example.backend.domain.recipe.entity.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipe")
public class RecipeController {
  @Autowired
  private RecipeService recipeService;

  // 모든 레시피 조회
  @GetMapping
  public ResponseEntity<List<Recipe>> getAllRecipes() {
    List<Recipe> recipes = recipeService.getAllRecipes();
    return ResponseEntity.ok(recipes);
  }

  // ID로 특정 레시피 조회
  @GetMapping("/{id}")
  public ResponseEntity<Recipe> getRecipeById(@PathVariable("id") String recipeId) {
    return recipeService.getRecipeById(recipeId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  // 새로운 레시피 추가
  @PostMapping
  public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
    Recipe createdRecipe = recipeService.createRecipe(recipe);
    return ResponseEntity.ok(createdRecipe);
  }

  // 레시피 삭제
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteRecipe(@PathVariable("id") String recipeId) {
    recipeService.deleteRecipe(recipeId);
    return ResponseEntity.noContent().build();
  }

}
