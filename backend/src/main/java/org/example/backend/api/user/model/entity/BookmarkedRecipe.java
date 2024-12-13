package org.example.backend.api.user.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.recipe.model.entity.Recipe;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkedRecipe {
  @EmbeddedId
  private RecipeUserId bookmarkedRecipeId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId", nullable = false, insertable = false, updatable = false)  // User와 관계를 설정
  private User user;  // BookmarkedRecipe는 User와 연관

  @Column(name = "recipeId", nullable = false, insertable = false, updatable = false)
  private String recipeId;  // Recipe의 ID를 참조하는 필드
}
