package org.example.backend.api.post.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.post.model.dto.PostDetailDto;
import org.example.backend.api.post.model.dto.PostRegisterDto;
import org.example.backend.api.post.model.dto.PostSimpleDto;
import org.example.backend.api.post.service.PostService;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {
  private final PostService postService;

  @GetMapping
  public ResponseEntity<List<PostSimpleDto>> getAllPosts(HttpServletRequest request) {
    List<PostSimpleDto> posts = postService.getAllPosts();
    return ResponseEntity.status(HttpStatus.OK).body(posts);
  }

  @PostMapping
  public ResponseEntity<PostDetailDto> addPost(HttpServletRequest request,
                                               @RequestBody PostRegisterDto postRegisterDto) {
    Long userId = (Long) request.getAttribute("userId");
    if (userId == null) {
      throw new UserIdNullException("userId not found");
    }
    PostDetailDto post = postService.addPost(userId, postRegisterDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(post);
  }

  @GetMapping("/{postId}")
  public ResponseEntity<PostDetailDto> getPostDetail(HttpServletRequest request, @PathVariable("postId") Long postId) {
    PostDetailDto post = postService.getPostDetail(postId);
    return ResponseEntity.status(HttpStatus.OK).body(post);
  }
}
