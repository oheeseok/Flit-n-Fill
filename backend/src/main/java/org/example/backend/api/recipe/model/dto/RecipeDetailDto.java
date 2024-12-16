package org.example.backend.api.recipe.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.recipe.model.entity.Recipe;
import org.example.backend.api.user.model.entity.User;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecipeDetailDto {
    private String recipeId;
    private String recipeTitle;
    private String recipeMainPhoto;
    private String recipeFoodDetails;
    private List<RecipeStepDto> recipeSteps;
    private boolean recipeIsVisibility;
    private String userNickname;
    private String userProfile;

    public static RecipeDetailDto of(Recipe recipe, User user) {
        RecipeDetailDto dto = new RecipeDetailDto();
        dto.setRecipeId(recipe.getRecipeId());
        dto.setRecipeTitle(recipe.getRecipeTitle());
        dto.setRecipeMainPhoto(recipe.getRecipeMainPhoto());
        dto.setRecipeFoodDetails(recipe.getRecipeFoodDetails());
        dto.setRecipeSteps(recipe.getRecipeSteps());
        dto.setRecipeIsVisibility(recipe.isRecipeIsVisibility());

        if (user != null) {
            dto.setUserNickname(user.getUserNickname());
            dto.setUserProfile(user.getUserProfile());
        } else {
            dto.setUserNickname(null);
            dto.setUserProfile(null);
        }
        return dto;
    }
}
