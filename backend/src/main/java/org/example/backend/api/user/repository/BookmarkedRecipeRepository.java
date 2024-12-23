package org.example.backend.api.user.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.example.backend.api.user.model.entity.BookmarkedRecipe;
import org.example.backend.api.user.model.entity.RecipeUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookmarkedRecipeRepository extends JpaRepository<BookmarkedRecipe, RecipeUserId> {
    @Query("SELECT br.recipeId FROM BookmarkedRecipe br WHERE br.user.userId = :userId")
    List<String> findRecipeIdsByUserId(@Param("userId") Long userId);
}
