package org.example.backend.api.recipe.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecipeSimpleDto {
    private String recipeId;
    private String recipeTitle;
    private String recipeMainPhoto;
    private boolean recipeIsVisibility;
    private String userNickname;
    private String userProfile;
}
