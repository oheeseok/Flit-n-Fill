package org.example.backend.api.recipe.model.entity;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.recipe.model.dto.RecipeRegisterDto;
import org.example.backend.api.recipe.model.dto.RecipeStepDto;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "recipe")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Recipe {
  @Id
  private String recipeId; // MongoDB의 기본 키

  private Long userId;

  @NotNull
  private String recipeTitle;

  @NotNull
  private String recipeMainPhoto;

  @NotNull
  private String recipeFoodDetails;

  @NotNull
  private List<RecipeStepDto> recipeSteps;

  @NotNull
  private boolean recipeIsVisibility = false;

  public static Recipe of(Long userId, RecipeRegisterDto dto) {
    Recipe recipe = new Recipe();
    recipe.setUserId(userId);
    recipe.setRecipeTitle(dto.getRecipeTitle());
    recipe.setRecipeMainPhoto(dto.getRecipeMainPhoto());
    recipe.setRecipeFoodDetails(dto.getRecipeFoodDetails());
    recipe.setRecipeSteps(dto.getRecipeSteps());
    recipe.setRecipeIsVisibility(dto.isRecipeIsVisibility());
    return recipe;
  }
}