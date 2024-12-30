package org.example.backend.api.trade.repository;

import org.example.backend.api.trade.model.entity.TradeRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface TradeRoomRepository extends MongoRepository<TradeRoom, String> {
    List<TradeRoom> findByWriterIdOrProposerId(Long writerId, Long proposerId);
}