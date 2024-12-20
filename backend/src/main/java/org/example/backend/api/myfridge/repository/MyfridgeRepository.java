package org.example.backend.api.myfridge.repository;

import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MyfridgeRepository extends JpaRepository<Food, Long> {
  Food findByFoodId(Long foodId);
  List<Food> findByUser(User user);
  List<Food> findByUserOrderByFoodExpDateAsc(User user);
  @Query("SELECT f FROM Food f WHERE f.foodExpDate BETWEEN :startDate AND :endDate")
  List<Food> findFoodByExpDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
