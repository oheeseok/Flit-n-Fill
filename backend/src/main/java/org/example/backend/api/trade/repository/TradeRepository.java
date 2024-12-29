package org.example.backend.api.trade.repository;

import org.example.backend.api.trade.model.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TradeRepository extends JpaRepository<Trade, Long> {
}
