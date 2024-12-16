package org.example.backend.api.post.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.post.model.dto.PostDetailDto;
import org.example.backend.api.post.model.dto.PostRegisterDto;
import org.example.backend.api.post.model.dto.PostSimpleDto;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.post.repository.PostRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PostService {
  private final PostRepository postRepository;
  private final UserRepository userRepository;

  public List<PostSimpleDto> getAllPosts() {
    List<Post> posts = postRepository.findAll();
    return posts.stream()
        .map(post -> {
          User user = userRepository.findById(post.getUser().getUserId()).orElse(null);
          return PostSimpleDto.of(post, user);
        })
        .collect(Collectors.toList());
  }

  public PostDetailDto addPost(Long userId, PostRegisterDto postRegisterDto) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    Post post = new Post();
    post.setAddress(user.getUserAddress());
    post.setWriterFood(postRegisterDto.getWriterFood());
    post.setWriterCount(postRegisterDto.getWriterCount());
    post.setWriterUnit(postRegisterDto.getWriterUnit());
    post.setProposerFood(postRegisterDto.getProposerFood());
    post.setProposerCount(postRegisterDto.getProposerCount());
    post.setProposerUnit(postRegisterDto.getProposerUnit());
    post.setPostContent(postRegisterDto.getPostContent());
    post.setPostPhoto1(postRegisterDto.getPostPhoto1());
    post.setPostPhoto2(postRegisterDto.getPostPhoto2());
    post.setTradeType(postRegisterDto.getTradeType());
    post.setMeetingPlace(postRegisterDto.getMeetingPlace());
    post.setMeetingTime(postRegisterDto.getMeetingTime());
    post.setPostCreatedDate(LocalDateTime.now());
//    post.setPostTitle();
    return null; // 임시
  }

}
