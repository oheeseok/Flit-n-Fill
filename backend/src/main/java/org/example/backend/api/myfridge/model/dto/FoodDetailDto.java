package org.example.backend.api.myfridge.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
    private int foodCount;
    private FoodUnit foodUnit;
    private LocalDate foodProDate;
    private LocalDate foodExpDate;
    private FoodStorage foodStorage;
    private boolean foodIsThaw;
    private String foodDescription;
    private int foodListIcon;
}
