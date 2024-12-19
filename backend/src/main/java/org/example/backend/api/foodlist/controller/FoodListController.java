package org.example.backend.api.foodlist.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.backend.api.foodlist.model.dto.FoodListViewDto;
import org.example.backend.api.foodlist.service.FoodListService;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/foodlist")
@RequiredArgsConstructor
public class FoodListController {
    private final FoodListService foodListService;

    // 재료 DB 전체 데이터 조회
    @GetMapping
    public ResponseEntity<List<FoodListViewDto>> getAllFoodList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        List<FoodListViewDto> allFoodList = foodListService.getAllFoodList();
        return ResponseEntity.status(HttpStatus.OK).body(allFoodList);
    }
}
