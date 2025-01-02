package org.example.backend.api.recipe.repository;

import org.example.backend.api.recipe.model.entity.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RecipeRepository extends MongoRepository<Recipe, String> {

  // findAll 메서드에 Pageable을 사용하여 페이징 처리
  Page<Recipe> findAll(Pageable pageable);
  List<Recipe> findByUserId(Long userId, Sort sort);
  List<Recipe> findByRecipeTitleContainingIgnoreCaseOrRecipeFoodDetailsContainingIgnoreCase(
      String titleKeyword, String detailsKeyword, Sort sort);
}
