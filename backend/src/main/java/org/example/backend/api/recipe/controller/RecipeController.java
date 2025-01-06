package org.example.backend.api.recipe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.recipe.model.dto.*;
import org.example.backend.api.recipe.service.RecipeService;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
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
                                                @RequestParam(value = "src", required = false) String src,
                                                @RequestParam(value = "food1", required = false) String food1,
                                                @RequestParam(value = "food2", required = false) String food2,
                                                @RequestParam(value = "food3", required = false) String food3,
                                                @RequestParam(value = "page", defaultValue = "0") int page,  // 기본 값 0
                                                @RequestParam(value = "size", defaultValue = "18") int size) {
        log.info("Received search query: {}", keyword); // 검색어 로그
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        Object result;

        List<String> foods = Arrays.asList(food1, food2, food3)
            .stream()
            .filter(food -> food != null && !food.isEmpty())
            .toList();

        // food1 ~ food5가 포함된 경우 처리
        if (!foods.isEmpty()) {
            result = recipeService.searchRecipesByFoods(userId, foods);
        }
        else if (keyword != null && ! keyword.isEmpty()) {
            // src이 null이 아니면 src와 keyword를 모두 사용하여 검색
            if ("youtube".equals(src)) {
                result = recipeService.searchYoutubeRecipes(keyword);
            } else {
                result = recipeService.searchRecipes(userId, keyword); // keyword만 사용하여 검색
            }
        } else {
            result = recipeService.getAllRecipes(userId, page, size); // 모든 레시피 조회
        }
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<RecipeDetailDto> getRecipeDetail(HttpServletRequest request, @PathVariable("recipeId") String recipeId) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        RecipeDetailDto recipe = recipeService.getRecipeDetail(userId, recipeId);
        return ResponseEntity.status(HttpStatus.OK).body(recipe);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecipeDetailDto> addRecipe(HttpServletRequest request,
                                                     @RequestPart("recipeRegisterDto") String recipeRegisterDtoJson,
                                                     @RequestPart("recipeMainPhoto") MultipartFile mainPhoto,
                                                     @RequestPart(value = "recipeStepPhotos", required = false) List<MultipartFile> stepPhotos) throws IOException {
        // RecipeRegisterDto를 JSON에서 객체로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        RecipeRegisterDto recipeRegisterDto = objectMapper.readValue(recipeRegisterDtoJson, RecipeRegisterDto.class);

        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        // 레시피 생성
        RecipeDetailDto recipe = recipeService.addRecipe(userId, recipeRegisterDto, mainPhoto, stepPhotos);
        return ResponseEntity.status(HttpStatus.CREATED).body(recipe);
    }

    @PutMapping(value = "/{recipeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecipeDetailDto> updateRecipe(HttpServletRequest request,
                                                        @PathVariable("recipeId") String recipeId,
                                                        @RequestPart("recipeUpdateDto") String recipeUpdateDtoJson,
                                                        @RequestPart(value = "recipeMainPhoto", required = false) MultipartFile mainPhoto,
                                                        @RequestPart(value = "recipeStepPhotos", required = false) List<MultipartFile> stepPhotos) throws IOException {
        // userId 확인
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        log.info("Received userId: {}", userId);

        // recipeUpdateDto JSON 출력
        log.info("Received recipeUpdateDto JSON: {}", recipeUpdateDtoJson);

        // mainPhoto 출력
        if (mainPhoto != null) {
            log.info("Main photo filename: {}", mainPhoto.getOriginalFilename());
            log.info("Main photo size: {}", mainPhoto.getSize());
        } else {
            log.info("No main photo received");
        }

        // stepPhotos 출력
        if (stepPhotos != null && !stepPhotos.isEmpty()) {
            for (int i = 0; i < stepPhotos.size(); i++) {
                MultipartFile stepPhoto = stepPhotos.get(i);
                log.info("Step photo {} filename: {}", i + 1, stepPhoto.getOriginalFilename());
                log.info("Step photo {} size: {}", i + 1, stepPhoto.getSize());
            }
        } else {
            log.info("No step photos received");
        }

        // JSON 문자열 -> DTO 변환 후 출력
        ObjectMapper objectMapper = new ObjectMapper();
        RecipeUpdateDto recipeUpdateDto = objectMapper.readValue(recipeUpdateDtoJson, RecipeUpdateDto.class);
        log.info("Parsed RecipeUpdateDto: {}", recipeUpdateDto);

        // 레시피 업데이트 서비스 호출
        RecipeDetailDto updatedRecipe = recipeService.updateRecipe(userId, recipeId, recipeUpdateDto, mainPhoto, stepPhotos);

        // 응답 데이터 출력
        log.info("Updated Recipe: {}", updatedRecipe);

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

    @GetMapping("/near-expiry")
    public ResponseEntity<List<RecipeSimpleDto>> recommendNearExpiryRecipes(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        List<RecipeSimpleDto> nearExpiryRecipes = recipeService.recommendNearExpiryRecipes(userId);
        return ResponseEntity.status(HttpStatus.OK).body(nearExpiryRecipes);
    }
}
