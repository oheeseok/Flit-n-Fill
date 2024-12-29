package org.example.backend.api.user.repository;

import org.example.backend.api.user.model.entity.BlackList;
import org.example.backend.api.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlackListRepository extends JpaRepository<BlackList, Long> {
    List<BlackList> findByReported_UserId(Long userId);
}
