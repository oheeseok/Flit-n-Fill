package org.example.backend.api.myfridge.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.enums.FoodStorage;
import org.example.backend.enums.FoodUnit;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodDetailDto {
    private Long foodId;
    private String foodListName;
    private LocalDate foodRegistDate;
    private float foodCount;
    private FoodUnit foodUnit;
    private LocalDate foodProDate;
    private LocalDate foodExpDate;
    private FoodStorage foodStorage;
    private boolean foodIsThaw;
    private String foodDescription;
    private String foodListIcon;

    public static FoodDetailDto of(Food food) {
        String foodListName = food.getFoodListName();
        String foodListIcon = food.getFoodList() == null ? "instant-food" : String.valueOf(food.getFoodList().getFoodListIcon());

        FoodDetailDto dto = new FoodDetailDto(
                food.getFoodId(),
                foodListName,
                food.getFoodRegistDate(),
                food.getFoodCount(),
                food.getFoodUnit(),
                food.getFoodProDate(),
                food.getFoodExpDate(),
                food.getFoodStorage(),
                food.isFoodIsThaw(),
                food.getFoodDescription(),
                foodListIcon
        );
        return dto;
    }
}
