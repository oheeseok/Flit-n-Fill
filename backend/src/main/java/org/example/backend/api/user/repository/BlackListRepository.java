package org.example.backend.api.user.repository;

import org.example.backend.api.user.model.entity.BlackList;
import org.example.backend.api.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlackListRepository extends JpaRepository<BlackList, Long> {
    Optional<BlackList> findByUser(User user);
}
