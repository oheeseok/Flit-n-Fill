package org.example.backend.domain.recipe.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "recipe")
@Getter
@Setter
public class Recipe {
  @Id
  private String recipeId; // MongoDB의 기본 키
  private long userId;
  private String recipeTitle;
  private String recipeIngredientDetails;
  private List<Step> recipeSteps;
  private boolean recipeIsVisibility;

  @Getter
  @Setter
  public static class Step {
    private String photo;
    private String description;
  }
}