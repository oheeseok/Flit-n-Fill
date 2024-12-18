package org.example.backend.api.user.repository;

import org.example.backend.api.user.model.entity.CartItem;
import org.example.backend.api.user.model.entity.UserCart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserCart(UserCart userCart);
}
