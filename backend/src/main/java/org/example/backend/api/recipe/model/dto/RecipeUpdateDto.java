package org.example.backend.api.recipe.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecipeUpdateDto {
    private String recipeTitle;
    private String recipeMainPhoto;
    private String recipeFoodDetails;
    private List<RecipeStepDto> recipeSteps;
}
