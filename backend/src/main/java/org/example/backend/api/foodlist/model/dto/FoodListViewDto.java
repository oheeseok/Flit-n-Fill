package org.example.backend.api.foodlist.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodListViewDto {
    private String foodListGroup;
    private String foodListProduct;
    private String foodListType;
    private int foodListIcon;
}
