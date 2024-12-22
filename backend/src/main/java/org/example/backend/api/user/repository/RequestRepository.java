package org.example.backend.api.user.repository;

import org.example.backend.api.user.model.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
}
