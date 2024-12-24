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
public class FoodUpdateDto {
    private float foodCount;
    private FoodUnit foodUnit;
    private LocalDate foodProDate;
    private LocalDate foodExpDate;
    private FoodStorage foodStorage;
    private String foodDescription;
}
