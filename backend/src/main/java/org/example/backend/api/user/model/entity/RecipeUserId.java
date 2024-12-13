package org.example.backend.api.user.model.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RecipeUserId implements Serializable {
  private Long userId;
  private String recipeId;

  // 기본 생성자
  public RecipeUserId() {}

  public RecipeUserId(Long userId, String recipeId) {
    this.userId = userId;
    this.recipeId = recipeId;
  }

  // getter, setter
  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getRecipeId() {
    return recipeId;
  }

  public void setRecipeId(String recipeId) {
    this.recipeId = recipeId;
  }

  // hashCode, equals 메소드 (복합키에서 필수)
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    RecipeUserId that = (RecipeUserId) o;
    return Objects.equals(userId, that.userId) && Objects.equals(recipeId, that.recipeId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userId, recipeId);
  }
}
