package org.example.backend.api.myfridge.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.foodlist.model.entity.FoodList;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.enums.FoodStorage;
import org.example.backend.enums.FoodUnit;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodSimpleDto {
    private Long foodId;
    private String foodListName;
    private FoodStorage foodStorage;
    private LocalDate foodExpDate;
    private int foodListIcon;

    public static FoodSimpleDto of(Food food) {
        int foodListIcon = food.getFoodList() != null ? food.getFoodList().getFoodListIcon() : 0; // 기본 값 0

        FoodSimpleDto dto = new FoodSimpleDto(
                food.getFoodId(),
                food.getFoodListName(),
                food.getFoodStorage(),
                food.getFoodExpDate(),
                foodListIcon
        );
        return dto;
    }
}
