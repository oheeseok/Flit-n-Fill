package org.example.backend.api.myfridge.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.foodlist.model.entity.FoodList;
import org.example.backend.api.foodlist.repository.FoodListRepository;
import org.example.backend.api.myfridge.model.dto.*;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
import org.example.backend.api.user.model.dto.CartSimpleDto;
import org.example.backend.api.user.model.entity.CartItem;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.model.entity.UserCart;
import org.example.backend.api.user.repository.CartItemRepository;
import org.example.backend.api.user.repository.RequestRepository;
import org.example.backend.api.user.repository.UserCartRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.FoodStorage;
import org.example.backend.enums.RequestType;
import org.example.backend.enums.TaskStatus;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class MyfridgeService {
    private final MyfridgeRepository myfridgeRepository;
    private final FoodListRepository foodListRepository;
    private final UserRepository userRepository;
    private final UserCartRepository userCartRepository;
    private final CartItemRepository cartItemRepository;
    private final RequestRepository requestRepository;

    public List<FoodSimpleDto> getAllFood(Long userId) {
        User user = userRepository.findById(userId).get();
        List<FoodSimpleDto> FoodSimpleDtoList = myfridgeRepository.findByUserOrderByFoodExpDateAsc(user).stream()
                .map(food -> FoodSimpleDto.of(food))
                .collect(Collectors.toList());
        return FoodSimpleDtoList;
    }

    public FoodDetailDto getFoodDetail(Long userId, Long foodId) {
        Food food = myfridgeRepository.findByFoodId(foodId);
        if (food == null) {
            throw new NoSuchElementException("해당 재료가 존재하지 않습니다.");
        }

        if (!food.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 음식에 대한 조회 권한이 없습니다.");
        }

        FoodDetailDto foodDetailDto = FoodDetailDto.of(food);
        return foodDetailDto;
    }

    public void addFood(Long userId, FoodAddDto foodDto) {
        FoodList foodList = foodListRepository.findById(foodDto.getFoodListId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid FoodList ID: " + foodDto.getFoodListId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        LocalDate registDate = foodDto.getFoodRegistDate();
        LocalDate expDate;

        if (foodDto.getFoodExpDate() != null) {
            expDate = foodDto.getFoodExpDate();
        } else {
            switch (foodDto.getFoodStorage()) {
                case FROZEN -> expDate = registDate.plusDays(365);
                case REFRIGERATED -> expDate = registDate.plusDays(7);
                case ROOM_TEMPERATURE -> expDate = registDate.plusDays(2);
                default -> throw new IllegalArgumentException("Invalid storage type: " + foodDto.getFoodStorage());
            }
        }

        String foodListName = foodList.getFoodListType();
        if (foodListName == null) {
            foodListName = foodList.getFoodListProduct();
        }

        Food food = new Food(
                null,
                user,
                foodList,
                foodListName,
                foodDto.getFoodCategory(),
                LocalDate.now(),
                foodDto.getFoodCount(),
                foodDto.getFoodUnit(),
                foodDto.getFoodProDate(),
                expDate,
                foodDto.getFoodStorage(),
                false,
                foodDto.getFoodDescription()
        );

        myfridgeRepository.save(food);
    }


    public void deleteFood(Long userId, Long foodId) {
        Food food = myfridgeRepository.findByFoodId(foodId);
        if (food == null) {
            throw new NoSuchElementException("해당 재료가 존재하지 않습니다.");
        }

        if (!food.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 재료에 대한 조회 권한이 없습니다.");
        }

        myfridgeRepository.delete(food);
    }


    public FoodDetailDto updateFood(Long userId, Long foodId, FoodUpdateDto foodUpdateDto) {
        Food food = myfridgeRepository.findByFoodId(foodId);
        if (food == null) {
            throw new NoSuchElementException("해당 재료가 존재하지 않습니다.");
        }

        if (!food.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 재료에 대한 조회 권한이 없습니다.");
        }

        if (food.isFoodIsThaw() && foodUpdateDto.getFoodStorage().equals(FoodStorage.FROZEN)) {
            throw new IllegalArgumentException("이미 해동된 재료는 다시 냉동할 수 없습니다.");
        }

        food.setFoodCount(foodUpdateDto.getFoodCount());
        food.setFoodUnit(foodUpdateDto.getFoodUnit());
        food.setFoodProDate(foodUpdateDto.getFoodProDate());
        if (food.getFoodStorage().equals(FoodStorage.FROZEN) && (foodUpdateDto.getFoodStorage().equals(FoodStorage.REFRIGERATED) || foodUpdateDto.getFoodStorage().equals(FoodStorage.ROOM_TEMPERATURE))) {  // 냉동 -> 냉장 or 냉동 -> 실온
            food.setFoodIsThaw(true);
            food.setFoodExpDate(LocalDate.now().plusDays(3));
        } else if ((food.getFoodStorage().equals(FoodStorage.REFRIGERATED) || foodUpdateDto.getFoodStorage().equals(FoodStorage.ROOM_TEMPERATURE)) && foodUpdateDto.getFoodStorage().equals(FoodStorage.FROZEN)){  // 냉장 -> 냉동 or 실온 -> 냉동
            food.setFoodExpDate(food.getFoodRegistDate().plusDays(365));
        } else {
            if (foodUpdateDto.getFoodExpDate() == null) {   // 소비기한 수정 안 한 경우
                if (foodUpdateDto.getFoodStorage().equals(FoodStorage.REFRIGERATED)) {  // 냉장
                    food.setFoodExpDate(LocalDate.now().plusDays(7));
                } else if (foodUpdateDto.getFoodStorage().equals(FoodStorage.ROOM_TEMPERATURE)) {   // 실온
                    food.setFoodExpDate(LocalDate.now().plusDays(2));
                }
            } else {
                food.setFoodExpDate(foodUpdateDto.getFoodExpDate());
            }
        }
        food.setFoodStorage(foodUpdateDto.getFoodStorage());
        food.setFoodDescription(foodUpdateDto.getFoodDescription());

        myfridgeRepository.save(food);
        return FoodDetailDto.of(food);
    }

    public void updateExpDate(Long userId, Long foodId, LocalDate expDate) {
        Food food = myfridgeRepository.findByFoodId(foodId);
        if (food == null) {
            throw new NoSuchElementException("해당 재료가 존재하지 않습니다.");
        }

        if (!food.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 재료에 대한 조회 권한이 없습니다.");
        }

        food.setFoodExpDate(expDate);
        myfridgeRepository.save(food);
    }

    //장바구니
    public List<CartSimpleDto> getMyCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        UserCart userCart = userCartRepository.findByUser(user);
        if (userCart == null) {
            throw new NoSuchElementException("장바구니가 존재하지 않습니다.");
        }
        List<CartItem> cartItemList = cartItemRepository.findByUserCart(userCart);

        List<CartSimpleDto> cartSimpleDtoList = cartItemList.stream()
                .map(cartItem -> new CartSimpleDto(userCart.getCartId(), cartItem.getMemo()))
                .collect(Collectors.toList());

        return cartSimpleDtoList;
    }

    public void saveCart(Long userId, List<String> memo) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        UserCart userCart = userCartRepository.findByUser(user);
        if (userCart == null) {
            throw new NoSuchElementException("장바구니가 존재하지 않습니다.");
        }

        cartItemRepository.deleteByUserCart(userCart);

        for (String m : memo) {
            CartItem cartItem = new CartItem();
            cartItem.setUserCart(userCart);
            cartItem.setMemo(m);

            cartItemRepository.save(cartItem);
        }
    }

    public void addItemToCart(Long userId, Long foodId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        UserCart userCart = userCartRepository.findByUser(user);
        if (userCart == null) {
            throw new NoSuchElementException("장바구니가 존재하지 않습니다.");
        }

        Food food = myfridgeRepository.findByFoodId(foodId);
        if (food == null) {
            throw new NoSuchElementException("해당 재료가 냉장고에 존재하지 않습니다.");
        }

        CartItem cartItem = new CartItem();
        cartItem.setUserCart(userCart);
        cartItem.setMemo(food.getFoodListName());
        cartItemRepository.save(cartItem);
    }

    public void requestAddFood(Long userId, String requestFood) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        Request request = new Request(
            null,
            user,
            RequestType.ADD_FOOD,
            requestFood,
            null,
            LocalDateTime.now(),
            TaskStatus.PENDING
        );

        requestRepository.save(request);
    }
}
