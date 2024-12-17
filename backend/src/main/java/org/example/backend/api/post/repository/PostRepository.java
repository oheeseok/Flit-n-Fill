package org.example.backend.api.post.repository;

import org.example.backend.api.post.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
  List<Post> findByPostTitleContainingOrderByPostCreatedDateDesc(String keyword);
  List<Post> findAllByOrderByPostCreatedDateDesc();
}
