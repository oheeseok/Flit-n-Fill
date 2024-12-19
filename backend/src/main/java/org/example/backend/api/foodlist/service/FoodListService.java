package org.example.backend.api.foodlist.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.foodlist.model.dto.FoodListViewDto;
import org.example.backend.api.foodlist.model.entity.FoodList;
import org.example.backend.api.foodlist.repository.FoodListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class FoodListService {
    private final FoodListRepository foodListRepository;

    public List<FoodListViewDto> getAllFoodList() {
        List<FoodList> all = foodListRepository.findAll();

        List<FoodListViewDto> allFoodList = foodListRepository.findAll().stream()
                .map(foodList -> FoodListViewDto.of(foodList))
                .collect(Collectors.toList());
        return allFoodList;
    }
}
