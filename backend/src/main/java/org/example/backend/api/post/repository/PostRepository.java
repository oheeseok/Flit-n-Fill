package org.example.backend.api.post.repository;

import org.example.backend.api.post.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
