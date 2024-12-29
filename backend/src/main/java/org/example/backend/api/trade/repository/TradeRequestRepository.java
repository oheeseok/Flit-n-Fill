package org.example.backend.api.trade.repository;

import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.api.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TradeRequestRepository extends JpaRepository<TradeRequest, Long> {
  // postId와 userId를 기준으로 TradeRequest 찾기
  Optional<TradeRequest> findFirstByPostAndProposerOrderByRequestCreatedDateDesc(Post post, User proposer);
  List<TradeRequest> findByPostId(Long postId);
}
