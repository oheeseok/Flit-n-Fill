package org.example.backend.api.foodlist.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.foodlist.model.entity.FoodList;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodListViewDto {
    private String foodListGroup;
    private String foodListProduct;
    private String foodListType;
    private int foodListIcon;

    public static FoodListViewDto of(FoodList foodList) {
        FoodListViewDto dto = new FoodListViewDto(
                foodList.getFoodListGroup(),
                foodList.getFoodListProduct(),
                foodList.getFoodListType(),
                foodList.getFoodListIcon()
        );
        return dto;
    }
}
