package org.example.backend.api.myfridge.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.foodlist.model.entity.FoodList;
import org.example.backend.api.foodlist.repository.FoodListRepository;
import org.example.backend.api.myfridge.model.dto.FoodAddDto;
import org.example.backend.api.myfridge.model.dto.FoodSimpleDto;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MyfridgeService {
    private final MyfridgeRepository myfridgeRepository;
    private final FoodListRepository foodListRepository;
    private final UserRepository userRepository;

    public List<FoodSimpleDto> getAllFood() {
        List<FoodSimpleDto> FoodSimpleDtoList = myfridgeRepository.findAll().stream()
                .map(food -> FoodSimpleDto.of(food))
                .collect(Collectors.toList());
        return FoodSimpleDtoList;
    }

    public void addFood(Long userId, FoodAddDto foodDto) {
        FoodList foodList = foodListRepository.findById(foodDto.getFoodListId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid FoodList ID: " + foodDto.getFoodListId()));

        //
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));
        log.info("========== User: {}", user.getUserName());
        //

        Food food = new Food(
                null,
                user,
                foodList,
                foodDto.getFoodListName(),
                foodDto.getFoodCategory(),
                foodDto.getFoodRegistDate() != null ? foodDto.getFoodRegistDate() : LocalDate.now(),
                foodDto.getFoodCount(),
                foodDto.getFoodUnit(),
                foodDto.getFoodProDate(),
                foodDto.getFoodExpDate(),
                foodDto.getFoodStorage(),
                false,
                foodDto.getFoodDescription()
        );

        myfridgeRepository.save(food);

    }
}