package org.example.backend.api.recipe.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.recipe.model.dto.RecipeDetailDto;
import org.example.backend.api.recipe.model.dto.RecipeRegisterDto;
import org.example.backend.api.recipe.model.dto.RecipeSimpleDto;
import org.example.backend.api.recipe.model.dto.RecipeUpdateDto;
import org.example.backend.api.recipe.model.entity.Recipe;
import org.example.backend.api.recipe.repository.RecipeRepository;
import org.example.backend.api.user.model.entity.BookmarkedRecipe;
import org.example.backend.api.user.model.entity.RecipeUserId;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.BookmarkedRecipeRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.RecipeNotFoundException;
import org.example.backend.exceptions.UnauthorizedException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Collections;
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
  private final BookmarkedRecipeRepository bookmarkedRecipeRepository;

  public void setRecipesUserIdToNull(Long userId) {
    List<Recipe> recipes = recipeRepository.findByUserId(userId);
    for (Recipe recipe : recipes) {
      recipe.setUserId(null);
    }
    recipeRepository.saveAll(recipes);
  }

  public List<RecipeSimpleDto> getAllRecipes() {
    List<Recipe> recipes = recipeRepository.findAll();
    return recipes.stream()
        .map(recipe -> {
          // 각 레시피에 해당하는 userId를 가진 User를 찾음
          User user = userRepository.findById(recipe.getUserId()).orElse(null);
          // Recipe -> RecipeSimpleDto로 변환
          return RecipeSimpleDto.of(recipe, user);
        })
        .collect(Collectors.toList());
  }

  /**
   * @param keyword
   * @return recipeTitle이나 recipeFoodDetails에 keyword가 포함된 레시피
   */
  public List<RecipeSimpleDto> searchRecipes(String keyword) {
    List<Recipe> recipes = recipeRepository.findByRecipeTitleContainingIgnoreCaseOrRecipeFoodDetailsContainingIgnoreCase(keyword, keyword);
    return recipes.stream()
        .map(recipe -> {
          User user = userRepository.findById(recipe.getUserId()).orElse(null);
          return RecipeSimpleDto.of(recipe, user);
        })
        .collect(Collectors.toList());
  }

  /**
   * @param keyword
   * @return youtube에 keyword를 검색한 검색 링크
   */
  public String searchYoutubeRecipes(String keyword) {
    try {
      // keyword를 URL에 맞게 인코딩
      String encodedKeyword = URLEncoder.encode((keyword + " 레시피"), "UTF-8");
      return String.format("https://www.youtube.com/results?search_query=%s", encodedKeyword);
    } catch (UnsupportedEncodingException e) {
      // 인코딩 오류 처리
      e.printStackTrace();
      return null;
    }
  }

  public RecipeDetailDto getRecipeDetail(String recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException("레시피를 찾을 수 없습니다."));

    Long userId = recipe.getUserId();
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

    return RecipeDetailDto.of(recipe, user);
  }

  public RecipeDetailDto addRecipe(Long userId, RecipeRegisterDto dto) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

    Recipe recipe = Recipe.of(userId, dto);
    Recipe savedRecipe = recipeRepository.save(recipe);

    return RecipeDetailDto.of(savedRecipe, user);
  }

  public RecipeDetailDto updateRecipe(Long userId, String recipeId, RecipeUpdateDto recipeUpdateDto) {
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException("레시피를 찾을 수 없습니다."));

    if (! recipe.getUserId().equals(userId)) {
      throw new UnauthorizedException("레시피 수정 권한이 없습니다.");
    }

    recipe.setRecipeTitle(recipeUpdateDto.getRecipeTitle());
    recipe.setRecipeMainPhoto(recipeUpdateDto.getRecipeMainPhoto());
    recipe.setRecipeFoodDetails(recipeUpdateDto.getRecipeFoodDetails());
    recipe.setRecipeSteps(recipeUpdateDto.getRecipeSteps());

    recipeRepository.save(recipe);

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

    return RecipeDetailDto.of(recipe, user);
  }


  public void changeRecipeVisibility(Long userId, String recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException("레시피를 찾을 수 없습니다."));

    if (! recipe.getUserId().equals(userId)) {
      throw new UnauthorizedException("레시피 수정 권한이 없습니다.");
    }

    recipe.setRecipeIsVisibility(! recipe.isRecipeIsVisibility());

    recipeRepository.save(recipe);
  }

  public void deleteRecipe(Long userId, String recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException("레시피를 찾을 수 없습니다."));

    if (! recipe.getUserId().equals(userId)) {
      throw new UnauthorizedException("레시피 삭제 권한이 없습니다.");
    }

    recipeRepository.deleteById(recipeId);
  }

  public void toggleRecipeBookmark(Long userId, String recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException("레시피를 찾을 수 없습니다. ID: " + recipeId));

    RecipeUserId bookmarkedRecipeId = new RecipeUserId(userId, recipeId);

    Optional<BookmarkedRecipe> existingBookmark = bookmarkedRecipeRepository.findById(bookmarkedRecipeId);

    if (existingBookmark.isPresent()) {
      // 이미 북마크된 경우 -> 북마크 삭제
      bookmarkedRecipeRepository.delete(existingBookmark.get());
    } else {
      // 북마크되지 않은 경우 -> 북마크 등록
      BookmarkedRecipe newBookmark = new BookmarkedRecipe();
      newBookmark.setBookmarkedRecipeId(bookmarkedRecipeId); // 복합키 설정

      // 필요 시 User와 Recipe 관계 설정
      User user = userRepository.findById(userId)
          .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
      newBookmark.setUser(user); // User 설정

      newBookmark.setRecipeId(recipeId); // Recipe ID 설정

      bookmarkedRecipeRepository.save(newBookmark);
    }


  }

  /**
   * random recipe 추천
   * @param userId
   * @return 랜덤한 레시피 5개 또는 전체 레시피(5개 미만인 경우)
   */
  public List<RecipeSimpleDto> getTodaysRecipe(Long userId) {
    List<Recipe> allRecipes = recipeRepository.findAll();

    // 레시피가 없는 경우
    if (allRecipes.isEmpty()) {
      return Collections.emptyList();
    }

    Collections.shuffle(allRecipes);

    List<Recipe> selectedRecipes = allRecipes.size() > 5
        ? allRecipes.subList(0, 5)
        : allRecipes;

    return selectedRecipes.stream()
        .map(recipe -> {
          User user = userRepository.findById(recipe.getUserId()).orElse(null);
          return RecipeSimpleDto.of(recipe, user);
        })
        .collect(Collectors.toList());
  }
}
