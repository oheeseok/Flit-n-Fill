package org.example.backend.api.myfridge.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.backend.api.myfridge.model.dto.*;
import org.example.backend.api.myfridge.service.MyfridgeService;
import org.example.backend.api.user.model.dto.CartSimpleDto;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity<Void> updateExpDate(HttpServletRequest request, @PathVariable("foodId") Long foodId, @RequestBody LocalDate expDate) {    // 냉장고 재료 소비기한 수정
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        myfridgeService.updateExpDate(userId, foodId, expDate);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    //장바구니
    @GetMapping("/shoppingcart")
    public ResponseEntity<List<String>> getMyCart(HttpServletRequest request) {      // 장바구니 조회
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        List<CartSimpleDto> allCart = myfridgeService.getMyCart(userId);
        List<String> memoList = allCart.stream()
                .map(CartSimpleDto::getMemo)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(memoList);
    }

    @PostMapping("/shoppingcart")
    public ResponseEntity<Void> saveCart(HttpServletRequest request, @RequestBody List<String> memo) {      // 장바구니 내용 저장
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        myfridgeService.saveCart(userId, memo);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/add/{foodId}")
    public ResponseEntity<Void> addItemToCart(HttpServletRequest request, @PathVariable("foodId") Long foodId) {      // 장바구니 재료 추가
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        myfridgeService.addItemToCart(userId, foodId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 재료 추가 요청
    @PostMapping("/request")
    public ResponseEntity<String> requestAddFood(HttpServletRequest request, @RequestBody String requestFood) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        if (requestFood == null || requestFood.trim().isEmpty()) {
            throw new IllegalArgumentException("요청한 재료 이름이 비어 있습니다.");
        }

        myfridgeService.requestAddFood(userId, requestFood);
        return ResponseEntity.status(HttpStatus.CREATED).body("재료 추가 요청이 접수되었습니다.");
    }
}
