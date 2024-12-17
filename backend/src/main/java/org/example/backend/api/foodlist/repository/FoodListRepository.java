package org.example.backend.api.foodlist.repository;

import org.example.backend.api.foodlist.model.entity.FoodList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodListRepository extends JpaRepository<FoodList, Long> {
  Optional<FoodList> findById(Long foodListId);
}
