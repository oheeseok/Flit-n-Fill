package org.example.backend.api.myfridge.repository;

import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyfridgeRepository extends JpaRepository<Food, Long> {
    Food findByFoodId(Long foodId);
    List<Food> findByUser(User user);
}
