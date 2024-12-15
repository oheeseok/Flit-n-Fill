package org.example.backend.api.recipe.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.recipe.model.dto.RecipeDetailDto;
import org.example.backend.api.recipe.model.dto.RecipeRegisterDto;
import org.example.backend.api.recipe.model.dto.RecipeSimpleDto;
import org.example.backend.api.recipe.model.entity.Recipe;
import org.example.backend.api.recipe.repository.RecipeRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.RecipeNotFoundException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public void setRecipesUserIdToNull(Long userId) {
        List<Recipe> recipes = recipeRepository.findByUserId(userId);
        for (Recipe recipe : recipes) {
            recipe.setUserId(null);
        }
        recipeRepository.saveAll(recipes);
    }

    public List<RecipeSimpleDto> getAllRecipes() {
        List<Recipe> recipes = recipeRepository.findAll();
        if (!recipes.isEmpty()) {
            return recipes.stream()
                    .map(recipe -> {
                        // 각 레시피에 해당하는 userId를 가진 User를 찾음
                        User user = userRepository.findById(recipe.getUserId()).orElse(null);
                        // Recipe -> RecipeSimpleDto로 변환
                        return RecipeSimpleDto.of(recipe, user);
                    })
                    .collect(Collectors.toList());
        }
        return null;
    }

    public RecipeDetailDto getRecipeDetail(String recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("레시피를 찾을 수 없습니다."));

        Long userId = recipe.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        return new RecipeDetailDto(
                recipe.getRecipeId(),
                recipe.getRecipeTitle(),
                recipe.getRecipeMainPhoto(),
                recipe.getRecipeFoodDetails(),
                recipe.getRecipeSteps(),
                recipe.isRecipeIsVisibility(),
                user.getUserNickname(),
                user.getUserProfile()
        );
    }

    public RecipeDetailDto addRecipe(Long userId, RecipeRegisterDto dto) {
        Recipe recipe = new Recipe();
        recipe.setUserId(userId);
        recipe.setRecipeTitle(dto.getRecipeTitle());
        recipe.setRecipeMainPhoto(dto.getRecipeMainPhoto());
        recipe.setRecipeFoodDetails(dto.getRecipeFoodDetails());
        recipe.setRecipeSteps(dto.getRecipeSteps());
        recipe.setRecipeIsVisibility(dto.isRecipeIsVisibility());

        Recipe savedRecipe = recipeRepository.save(recipe);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        RecipeDetailDto recipeDetailDto = new RecipeDetailDto();
        recipeDetailDto.setRecipeId(savedRecipe.getRecipeId());
        recipeDetailDto.setRecipeTitle(savedRecipe.getRecipeTitle());
        recipeDetailDto.setRecipeMainPhoto(savedRecipe.getRecipeMainPhoto());
        recipeDetailDto.setRecipeFoodDetails(savedRecipe.getRecipeFoodDetails());
        recipeDetailDto.setRecipeSteps(savedRecipe.getRecipeSteps());
        recipeDetailDto.setRecipeIsVisibility(savedRecipe.isRecipeIsVisibility());
        recipeDetailDto.setUserNickname(user.getUserNickname());
        recipeDetailDto.setUserProfile(user.getUserProfile());

        return recipeDetailDto;
    }
}
