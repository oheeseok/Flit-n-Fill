package org.example.backend.api.trade.repository;

import org.example.backend.api.trade.model.entity.Kindness;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KindnessRepository extends JpaRepository<Kindness, Long> {
}