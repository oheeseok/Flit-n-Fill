package org.example.backend.api.recipe.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.recipe.model.dto.RecipeDetailDto;
import org.example.backend.api.recipe.model.dto.RecipeRegisterDto;
import org.example.backend.api.recipe.model.dto.RecipeSimpleDto;
import org.example.backend.api.recipe.service.RecipeService;
import org.example.backend.exceptions.UserIdNullException;
import org.example.backend.security.Authenticate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Slf4j
public class RecipeController {
    private final RecipeService recipeService;

    @Authenticate
    @GetMapping
    public ResponseEntity<List<RecipeSimpleDto>> getAllRecipes(HttpServletRequest request) {
        List<RecipeSimpleDto> recipes = recipeService.getAllRecipes();
        return ResponseEntity.status(HttpStatus.OK).body(recipes);
    }

    @Authenticate
    @GetMapping("/{recipeId}")
    public ResponseEntity<RecipeDetailDto> getRecipeDetail(HttpServletRequest request, @PathVariable("recipeId") String recipeId) {
        RecipeDetailDto recipe = recipeService.getRecipeDetail(recipeId);
        return ResponseEntity.status(HttpStatus.OK).body(recipe);
    }

    @Authenticate
    @PostMapping
    public ResponseEntity<RecipeDetailDto> addRecipe(HttpServletRequest request, @RequestBody RecipeRegisterDto recipeRegisterDto) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        RecipeDetailDto recipe = recipeService.addRecipe(userId, recipeRegisterDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(recipe);
    }


}
