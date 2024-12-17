package org.example.backend.api.foodlist.repository;

import org.example.backend.api.foodlist.model.entity.FoodList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodListRepository extends JpaRepository<FoodList, Long> {

}
