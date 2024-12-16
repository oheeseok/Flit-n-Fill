package org.example.backend.api.myfridge.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.myfridge.model.dto.FoodAddDto;
import org.example.backend.api.myfridge.model.dto.FoodDetailDto;
import org.example.backend.api.myfridge.model.dto.FoodSimpleDto;
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
@Slf4j
public class MyfridgeController {
    private final MyfridgeService myfridgeService;

    @GetMapping
    public ResponseEntity<List<FoodSimpleDto>> getAllFood(HttpServletRequest request) {// 냉장고 재료 전체 조회
        Long userId = (Long) request.getAttribute("userId");
        log.info("========== getAllFood UserID: {}", userId);
        List<FoodSimpleDto> allFood = myfridgeService.getAllFood();
        return ResponseEntity.status(HttpStatus.CREATED).body(allFood);
    }

    @PostMapping
    public ResponseEntity<Void> addFood(HttpServletRequest request, @RequestBody FoodAddDto foodAddDto) {// 냉장고 재료 등록
        log.info("========== addFood: {}", foodAddDto);
        Long userId = (Long) request.getAttribute("userId");
        log.info("========== UserID: {}", userId);
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        myfridgeService.addFood(userId, foodAddDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
