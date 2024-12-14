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
public class FoodSimpleDto {
    private Long foodId;
    private String foodListName;
    private FoodStorage foodStorage;
    private LocalDate foodExpDate;
    private int foodCount;
    private FoodUnit foodUnit;
    private int foodListIcon;
}
