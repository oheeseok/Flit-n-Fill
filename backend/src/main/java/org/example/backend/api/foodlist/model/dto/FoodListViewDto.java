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
    private Long foodListId;
    private String foodListGroup;
    private String foodListType;
    private String foodListProduct;
    private int foodListIcon;

    public static FoodListViewDto of(FoodList foodList) {
        FoodListViewDto dto = new FoodListViewDto(
                foodList.getFoodListId(),
                foodList.getFoodListGroup(),
                foodList.getFoodListProduct(),
                foodList.getFoodListType(),
                foodList.getFoodListIcon()
        );
        return dto;
    }
}
