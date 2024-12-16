package org.example.backend.api.user.repository;

import org.example.backend.api.user.model.entity.BookmarkedRecipe;
import org.example.backend.api.user.model.entity.RecipeUserId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkedRecipeRepository extends JpaRepository<BookmarkedRecipe, RecipeUserId> {
}
