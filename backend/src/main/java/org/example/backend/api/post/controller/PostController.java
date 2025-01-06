package org.example.backend.api.post.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.post.model.dto.*;
import org.example.backend.api.post.service.PostService;
import org.example.backend.exceptions.TradeRequestHandleException;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {
    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostDetailDto>> getAllPosts(HttpServletRequest request,
                                                           @RequestParam(value = "search-query", required = false) String keyword) {
        List<PostDetailDto> posts = new ArrayList<>();
        if (keyword != null && !keyword.isEmpty()) {
            posts = postService.searchPost(keyword);
        } else {
            posts = postService.getAllPosts();
        }
        return ResponseEntity.status(HttpStatus.OK).body(posts);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDetailDto> addPost(HttpServletRequest request,
                                                 @RequestPart("postRegisterDto") String postRegisterDtoJson,
                                                 @RequestPart("postMainPhoto") MultipartFile postMainPhoto) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        PostRegisterDto postRegisterDto = objectMapper.readValue(postRegisterDtoJson, PostRegisterDto.class);

        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        PostDetailDto post = postService.addPost(userId, postRegisterDto, postMainPhoto);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailDto> getPostDetail(HttpServletRequest request, @PathVariable("postId") Long postId) {
        PostDetailDto post = postService.getPostDetail(postId);
        return ResponseEntity.status(HttpStatus.OK).body(post);
    }

    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDetailDto> updatePost(HttpServletRequest request,
                                                    @PathVariable("postId") Long postId,
                                                    @RequestPart("postUpdateDto") String postUpdateDtoJson,
                                                    @RequestPart(value = "postMainPhoto", required = false) MultipartFile postMainPhoto) throws IOException {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        PostUpdateDto postUpdateDto = objectMapper.readValue(postUpdateDtoJson, PostUpdateDto.class);

        PostDetailDto updatedPost = postService.updatePost(userId, postId, postUpdateDto, postMainPhoto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedPost);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(HttpServletRequest request,
                                           @PathVariable("postId") Long postId) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        postService.deletePost(userId, postId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/{postId}/request")
    public ResponseEntity<Void> handleTradeRequest(HttpServletRequest request,
                                                   @PathVariable("postId") Long postId,
                                                   @RequestBody ActionRequest actionRequest) {
        Long userId = (Long) request.getAttribute("userId");
        log.info("PostController.handleTradeRequest userId: {}", userId);
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        String action = actionRequest.getAction();
        postService.handleTradeRequest(userId, postId, action);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
