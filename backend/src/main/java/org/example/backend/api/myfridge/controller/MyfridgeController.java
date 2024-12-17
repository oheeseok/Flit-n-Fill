package org.example.backend.api.myfridge.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.myfridge.model.dto.*;
import org.example.backend.api.myfridge.service.MyfridgeService;
import org.example.backend.exceptions.UserIdNullException;
import org.example.backend.security.Authenticate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/my-fridge")
@RequiredArgsConstructor
public class MyfridgeController {
    private final MyfridgeService myfridgeService;

    @GetMapping
    public ResponseEntity<List<FoodSimpleDto>> getAllFood(HttpServletRequest request) {// 냉장고 재료 전체 조회
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        List<FoodSimpleDto> allFood = myfridgeService.getAllFood(userId);
        return ResponseEntity.status(HttpStatus.OK).body(allFood);
    }

    @GetMapping("/{foodId}")
    public ResponseEntity<FoodDetailDto> getFoodDetail(HttpServletRequest request, @PathVariable("foodId") Long foodId) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        FoodDetailDto food = myfridgeService.getFoodDetail(userId, foodId);
        return ResponseEntity.status(HttpStatus.OK).body(food);

    }

    @PostMapping
    public ResponseEntity<Void> addFood(HttpServletRequest request, @RequestBody FoodAddDto foodAddDto) {   // 냉장고 재료 등록
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        myfridgeService.addFood(userId, foodAddDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{foodId}")
    public ResponseEntity<Void> deleteFood(HttpServletRequest request, @PathVariable("foodId") Long foodId) {   // 냉장고 재료 삭제
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        myfridgeService.deleteFood(userId, foodId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{foodId}")
    public ResponseEntity<FoodDetailDto> updateFood(HttpServletRequest request, @PathVariable("foodId") Long foodId, @RequestBody FoodUpdateDto foodUpdateDto) {    // 냉장고 재료 수정
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        FoodDetailDto food = myfridgeService.updateFood(userId, foodId, foodUpdateDto);
        return ResponseEntity.status(HttpStatus.OK).body(food);
    }

    @PatchMapping("/{foodId}/exp-date")
    public ResponseEntity<Void> updateExpDate(HttpServletRequest request, @PathVariable("foodId") Long foodId, @RequestBody FoodUpdateDto foodUpdateDto) {    // 냉장고 재료 소비기한 수정
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        myfridgeService.updateExpDate(userId, foodId, foodUpdateDto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
