package org.example.backend.api.trade.repository;

import org.example.backend.api.trade.model.entity.TradeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TradeRequestRepository extends JpaRepository<TradeRequest, Long> {
}
