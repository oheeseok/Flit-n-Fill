package org.example.backend.api.trade.repository;

import org.example.backend.api.trade.model.entity.Kindness;
import org.example.backend.api.trade.model.entity.TradeRoom;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface KindnessRepository extends MongoRepository<Kindness, Long> {
}