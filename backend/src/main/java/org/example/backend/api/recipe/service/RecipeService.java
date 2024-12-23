package org.example.backend.api.recipe.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
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
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RecipeService {
  private final RecipeRepository recipeRepository;
  private final UserRepository userRepository;
  private final BookmarkedRecipeRepository bookmarkedRecipeRepository;
  private final MyfridgeRepository myfridgeRepository;
  private final MongoTemplate mongoTemplate;

  public void setRecipesUserIdToNull(Long userId) {
    Query query = new Query(Criteria.where("userId").is(userId));
    Update update = new Update().set("userId", null);

    mongoTemplate.updateMulti(query, update, Recipe.class);

    log.info("setRecipesUserIdToNull: Updated recipes with userId {} to null", userId);
  }

  public List<RecipeSimpleDto> getAllRecipes(Long userId) {
    List<String> bookmarkedRecipeIds = bookmarkedRecipeRepository.findRecipeIdsByUserId(userId);
    List<Recipe> recipes = recipeRepository.findAll(Sort.by(Sort.Direction.DESC, "recipeCreatedDate"));
    return recipes.stream()
        .map(recipe -> {
          User user = recipe.getUserId() != null ? userRepository.findById(recipe.getUserId()).orElse(null) : null;
          // Recipe -> RecipeSimpleDto로 변환
          RecipeSimpleDto recipeSimpleDto = RecipeSimpleDto.of(recipe, user);
          recipeSimpleDto.setRecipeIsBookmarked(bookmarkedRecipeIds.contains(recipeSimpleDto.getRecipeId()));
          return recipeSimpleDto;
        })
        .collect(Collectors.toList());
  }

  /**
   * @param keyword
   * @return recipeTitle이나 recipeFoodDetails에 keyword가 포함된 레시피
   */
  public List<RecipeSimpleDto> searchRecipes(Long userId, String keyword) {
    List<String> bookmarkedRecipeIds = bookmarkedRecipeRepository.findRecipeIdsByUserId(userId);
    List<Recipe> recipes = recipeRepository.findByRecipeTitleContainingIgnoreCaseOrRecipeFoodDetailsContainingIgnoreCase(keyword, keyword, Sort.by(Sort.Direction.DESC, "recipeCreatedDate"));
    return recipes.stream()
        .map(recipe -> {
          User user = recipe.getUserId() != null ? userRepository.findById(recipe.getUserId()).orElse(null) : null;
          RecipeSimpleDto recipeSimpleDto = RecipeSimpleDto.of(recipe, user);
          recipeSimpleDto.setRecipeIsBookmarked(bookmarkedRecipeIds.contains(recipeSimpleDto.getRecipeId()));
          return recipeSimpleDto;
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

  public RecipeDetailDto getRecipeDetail(Long userId, String recipeId) {
    List<String> bookmarkedRecipeIds = bookmarkedRecipeRepository.findRecipeIdsByUserId(userId);
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException("레시피를 찾을 수 없습니다."));

    User user = recipe.getUserId() != null ? userRepository.findById(recipe.getUserId()).orElse(null) : null;
    RecipeDetailDto recipeDetailDto = RecipeDetailDto.of(recipe, user);
    recipeDetailDto.setRecipeIsBookmarked(bookmarkedRecipeIds.contains(recipeDetailDto.getRecipeId()));
    return recipeDetailDto;
  }

  public RecipeDetailDto addRecipe(Long userId, RecipeRegisterDto dto) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

    Recipe recipe = Recipe.of(userId, dto);
    Recipe savedRecipe = recipeRepository.save(recipe);

    RecipeDetailDto recipeDetailDto = RecipeDetailDto.of(savedRecipe, user);
    recipeDetailDto.setRecipeIsBookmarked(false);

    return recipeDetailDto;
  }

  public RecipeDetailDto updateRecipe(Long userId, String recipeId, RecipeUpdateDto recipeUpdateDto) {
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException("레시피를 찾을 수 없습니다."));

    if (!recipe.getUserId().equals(userId)) {
      throw new UnauthorizedException("레시피 수정 권한이 없습니다.");
    }

    recipe.setRecipeTitle(recipeUpdateDto.getRecipeTitle());
    recipe.setRecipeMainPhoto(recipeUpdateDto.getRecipeMainPhoto());
    recipe.setRecipeFoodDetails(recipeUpdateDto.getRecipeFoodDetails());
    recipe.setRecipeSteps(recipeUpdateDto.getRecipeSteps());

    recipeRepository.save(recipe);

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

    RecipeDetailDto recipeDetailDto = RecipeDetailDto.of(recipe, user);
    recipeDetailDto.setRecipeIsBookmarked(false);

    return recipeDetailDto;
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
    recipeRepository.findById(recipeId)
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
    List<String> bookmarkedRecipeIds = bookmarkedRecipeRepository.findRecipeIdsByUserId(userId);
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
          User user = recipe.getUserId() != null ? userRepository.findById(recipe.getUserId()).orElse(null) : null;
          RecipeSimpleDto recipeSimpleDto = RecipeSimpleDto.of(recipe, user);
          recipeSimpleDto.setRecipeIsBookmarked(bookmarkedRecipeIds.contains(recipeSimpleDto.getRecipeId()));
          return recipeSimpleDto;
        })
        .collect(Collectors.toList());
  }

  /**
   * 소비기한이 임박한 재료들을 포함한 레시피 추천
   * today - 2 < expdate < today + 5
   * @param userId
   * @return
   */
  public List<RecipeSimpleDto> recommendNearExpiryRecipes(Long userId) {
    List<String> bookmarkedRecipeIds = bookmarkedRecipeRepository.findRecipeIdsByUserId(userId);

    LocalDate today = LocalDate.now();
    LocalDate startDate = today.minusDays(2);
    LocalDate endDate = today.plusDays(3);
    // 소비기한이 임박한 food 조회
    List<Food> foodByExpDateRange = myfridgeRepository.findFoodByExpDateRange(startDate, endDate);

    // 동일한 이름의 food가 존재하면, 소비기한이 가장 짧은 것만 남기고 중복 제거
    Map<String, Food> filteredFoodMap = new HashMap<>();
    for (Food food : foodByExpDateRange) {
      String foodName = food.getFoodListName();
      filteredFoodMap.merge(foodName, food, (existing, current) ->
          existing.getFoodExpDate().isBefore(current.getFoodExpDate()) ? existing : current
      );
    }

    // 소비기한 임박 순으로 정렬
    List<Food> filteredFoodList = filteredFoodMap.values().stream()
        .sorted(Comparator.comparing(Food::getFoodExpDate))
        .collect(Collectors.toList());

    // 가중치 부여 (가중치 = today - foodExpDate + 3)
    Map<String, Integer> foodWeightMap = new HashMap<>();
    for (Food food : filteredFoodList) {
      String foodName = food.getFoodListName();
      int weight = food.getFoodExpDate().until(today).getDays() + 3;
      foodWeightMap.put(foodName, weight);
    }

    List<Recipe> recipeList = recipeRepository.findAll();
    Map<String, Pair<Integer, Integer>> recipeWeightAndCountMap = new HashMap<>();

    for (Recipe recipe : recipeList) {
      String recipeFoodDetails = recipe.getRecipeFoodDetails();
      String recipeId = recipe.getRecipeId();

      int maxWeight = 0; // 가장 큰 가중치
      int ingredientCount = 0; // 포함된 재료 개수

      for (Map.Entry<String, Integer> entry : foodWeightMap.entrySet()) {
        String ingredient = entry.getKey();
        int weight = entry.getValue();

        // Recipe의 foodDetails에 재료 이름 포함 여부 확인
        if (recipeFoodDetails.toLowerCase().contains(ingredient.toLowerCase())) {
          ingredientCount++; // 포함된 재료 개수 증가
          maxWeight = Math.max(maxWeight, weight); // 최대 가중치 갱신
        }
      }

      if (ingredientCount > 0) {
        recipeWeightAndCountMap.put(recipeId, new Pair<>(maxWeight, ingredientCount));
      }
    }

    // recipeWeightAndCountMap을 가중치와 개수에 따라 정렬 (내림차순 정렬)
    List<Map.Entry<String, Pair<Integer, Integer>>> sortedEntries = recipeWeightAndCountMap.entrySet()
        .stream()
        .sorted((entry1, entry2) -> {
          // 먼저 Weight 기준 내림차순
          int weightComparison = Integer.compare(entry2.getValue().getFirst(), entry1.getValue().getFirst());
          if (weightComparison != 0) {
            return weightComparison;
          }
          // Weight가 동일하면 Count 기준 내림차순
          return Integer.compare(entry2.getValue().getSecond(), entry1.getValue().getSecond());
        })
        .collect(Collectors.toList());

    // 정렬된 결과를 RecipeSimpleDto로 변환
    List<RecipeSimpleDto> result = new ArrayList<>();
    for (Map.Entry<String, Pair<Integer, Integer>> entry : sortedEntries) {
      String recipeId = entry.getKey();
      Recipe recipe = recipeRepository.findById(recipeId).orElse(null); // Recipe 조회
      User user = recipe.getUserId() != null ? userRepository.findById(recipe.getUserId()).orElse(null) : null;

      // Recipe가 존재하면 RecipeSimpleDto 생성
      if (recipe != null) {
        RecipeSimpleDto dto = RecipeSimpleDto.of(recipe, user);
        dto.setRecipeIsBookmarked(bookmarkedRecipeIds.contains(dto.getRecipeId()));
        result.add(dto);
      }
    }
    return result;
  }

  public static class Pair<K, V> {
    private final K first;
    private final V second;

    public Pair(K first, V second) {
      this.first = first;
      this.second = second;
    }

    public K getFirst() {
      return first;
    }

    public V getSecond() {
      return second;
    }
  }

}
