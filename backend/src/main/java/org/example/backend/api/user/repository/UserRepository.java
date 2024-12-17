package org.example.backend.api.user.repository;

import org.example.backend.api.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUserEmail(String userEmail);
    boolean existsByUserNickname(String userNickname);
    Optional<User> findByUserEmail(String userEmail);

}
