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
import org.example.backend.exceptions.PostNotFoundException;
import org.example.backend.exceptions.UserNotFoundException;
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
        .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

    Post post = Post.of(user, postRegisterDto);

    Post savedPost = postRepository.save(post);
    return PostDetailDto.of(savedPost, savedPost.getUser());
  }

  public PostDetailDto getPostDetail(Long postId) {
    Post post = postRepository.findById(postId)
            .orElseThrow(() -> new PostNotFoundException("게시글을 찾을 수 없습니다."));

    Long userId = post.getUser().getUserId();
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

    return PostDetailDto.of(post, post.getUser());
  }
}
