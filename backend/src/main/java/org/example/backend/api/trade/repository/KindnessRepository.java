package org.example.backend.api.trade.repository;

import org.example.backend.api.trade.model.entity.Kindness;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KindnessRepository extends JpaRepository<Kindness, Long> {
    Optional<Kindness> findByTradeRoomIdAndReviewer_UserId(String tradeRoomId, Long userId);
}