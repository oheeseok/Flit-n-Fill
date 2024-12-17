package org.example.backend.api.recipe.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.recipe.model.dto.RecipeDetailDto;
import org.example.backend.api.recipe.model.dto.RecipeRegisterDto;
import org.example.backend.api.recipe.model.dto.RecipeSimpleDto;
import org.example.backend.api.recipe.model.dto.RecipeUpdateDto;
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

    @GetMapping
    public ResponseEntity<Object> getAllRecipes(HttpServletRequest request,
                                                @RequestParam(value = "search-query", required = false) String keyword,
                                                @RequestParam(value = "src", required = false) String src) {
        Object result;
        if (keyword != null && ! keyword.isEmpty()) {
            // src이 null이 아니면 src와 keyword를 모두 사용하여 검색
            if ("youtube".equals(src)) {
                result = recipeService.searchYoutubeRecipes(keyword);
            } else {
                result = recipeService.searchRecipes(keyword); // keyword만 사용하여 검색
            }
        } else {
            result = recipeService.getAllRecipes(); // 모든 레시피 조회
        }
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<RecipeDetailDto> getRecipeDetail(HttpServletRequest request, @PathVariable("recipeId") String recipeId) {
        RecipeDetailDto recipe = recipeService.getRecipeDetail(recipeId);
        return ResponseEntity.status(HttpStatus.OK).body(recipe);
    }

    @PostMapping
    public ResponseEntity<RecipeDetailDto> addRecipe(HttpServletRequest request, @RequestBody RecipeRegisterDto recipeRegisterDto) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        RecipeDetailDto recipe = recipeService.addRecipe(userId, recipeRegisterDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(recipe);
    }

    @PutMapping("/{recipeId}")
    public ResponseEntity<RecipeDetailDto> updateRecipe(HttpServletRequest request,
                                                        @PathVariable("recipeId") String recipeId,
                                                        @RequestBody RecipeUpdateDto recipeUpdateDto) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        RecipeDetailDto updatedRecipe = recipeService.updateRecipe(userId, recipeId, recipeUpdateDto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedRecipe);
    }

    @PatchMapping("/{recipeId}/visibility")
    public ResponseEntity<Void> changeRecipeVisibility(HttpServletRequest request,
                                                       @PathVariable("recipeId") String recipeId) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        recipeService.changeRecipeVisibility(userId, recipeId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> deleteRecipe(HttpServletRequest request,
                                             @PathVariable("recipeId") String recipeId) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        recipeService.deleteRecipe(userId, recipeId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/{recipeId}")
    public ResponseEntity<Void> toggleRecipeBookmark(HttpServletRequest request,
                                                     @PathVariable("recipeId") String recipeId) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        recipeService.toggleRecipeBookmark(userId, recipeId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/todays-recipe")
    public ResponseEntity<List<RecipeSimpleDto>> getTodaysRecipe(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        List<RecipeSimpleDto> todaysRecipe = recipeService.getTodaysRecipe(userId);
        return ResponseEntity.status(HttpStatus.OK).body(todaysRecipe);
    }
}
