package org.example.backend.api.post.repository;

import org.example.backend.api.post.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
  List<Post> findAllByOrderByPostCreatedDateDesc();
  @Query("SELECT p FROM Post p " +
      "JOIN p.writerFood f " +
      "LEFT JOIN p.proposerFoodList fl " +
      "WHERE (LOWER(f.foodListName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
      "OR (fl IS NOT NULL AND LOWER(fl.foodListProduct) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
      "OR (fl IS NOT NULL AND LOWER(fl.foodListType) LIKE LOWER(CONCAT('%', :keyword, '%')))) " +
      "ORDER BY p.postCreatedDate DESC")
  List<Post> findByKeyword(@Param("keyword") String keyword);
}
