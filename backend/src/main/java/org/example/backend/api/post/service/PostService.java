package org.example.backend.api.post.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.foodlist.model.entity.FoodList;
import org.example.backend.api.foodlist.repository.FoodListRepository;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
import org.example.backend.api.post.model.dto.PostDetailDto;
import org.example.backend.api.post.model.dto.PostRegisterDto;
import org.example.backend.api.post.model.dto.PostSimpleDto;
import org.example.backend.api.post.model.dto.PostUpdateDto;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.post.repository.PostRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.PostNotFoundException;
import org.example.backend.exceptions.UnauthorizedException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PostService {
  private final PostRepository postRepository;
  private final UserRepository userRepository;
  private final MyfridgeRepository myfridgeRepository;
  private final FoodListRepository foodListRepository;

  public List<PostSimpleDto> getAllPosts() {
    List<Post> posts = postRepository.findAllByOrderByPostCreatedDateDesc();
    return posts.stream()
        .map(post -> {
          User user = userRepository.findById(post.getUser().getUserId()).orElse(null);
          return PostSimpleDto.of(post, user);
        })
        .collect(Collectors.toList());
  }

  public List<PostSimpleDto> searchPost(String keyword) {
    List<Post> posts = postRepository.findByPostTitleContainingOrderByPostCreatedDateDesc(keyword);
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
    // setPostTitle만 따로 하는 이유: myfridgeRepository, foodListRepository를 써야하기 때문

    Optional<Food> writerFood = myfridgeRepository.findById(postRegisterDto.getWriterFoodId());
    if (! writerFood.isPresent()) {
      throw new NoSuchElementException("Food does not exist with ID: " + postRegisterDto.getWriterFoodId());
    }

    Optional<FoodList> foodList = foodListRepository.findById(postRegisterDto.getProposerFoodListId());
    if (! foodList.isPresent()) {
      throw new NoSuchElementException("FoodList does not exist with ID: " + postRegisterDto.getProposerFoodListId());
    }

    String writerFoodName = writerFood.get().getFoodListName();
    String proposerFoodName = foodList.get().getFoodListType() == null ?
        foodList.get().getFoodListProduct() :
        foodList.get().getFoodListType();

    log.info("[PostService.addPost] writerFoodName: {}, proposerFoodName: {}", writerFoodName, proposerFoodName);

    String postTitle = String.format("[%s/%s] %s -> %s",
        postRegisterDto.getTradeType().getDescription(),
        user.getUserAddress(),
        writerFoodName,
        proposerFoodName);
    post.setPostTitle(postTitle);

    post.setWriterFood(writerFood.get());
    post.setProposerFoodList(foodList.get());

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


  public PostDetailDto updatePost(Long userId, Long postId, PostUpdateDto postUpdateDto) {
    Post post = postRepository.findById(postId)
           .orElseThrow(() -> new PostNotFoundException("게시글을 찾을 수 없습니다."));

    if (!post.getUser().getUserId().equals(userId)) {
      throw new UnauthorizedException("게시글 수정 권한이 없습니다.");
    }

    Optional<Food> writerFood = myfridgeRepository.findById(postUpdateDto.getWriterFoodId());
    if (! writerFood.isPresent()) {
      throw new NoSuchElementException("Food does not exist with ID: " + postUpdateDto.getWriterFoodId());
    }

    Optional<FoodList> foodList = foodListRepository.findById(postUpdateDto.getProposerFoodListId());
    if (! foodList.isPresent()) {
      throw new NoSuchElementException("FoodList does not exist with ID: " + postUpdateDto.getProposerFoodListId());
    }

    String writerFoodName = writerFood.get().getFoodListName();
    String proposerFoodName = foodList.get().getFoodListType() == null ?
        foodList.get().getFoodListProduct() :
        foodList.get().getFoodListType();

    log.info("[PostService.updatePost] writerFoodName: {}, proposerFoodName: {}", writerFoodName, proposerFoodName);

    // 글 수정 시 교환, 나눔은 불변
    // 글 수정 시 사용자의 위치로 변경

    post.setPostContent(postUpdateDto.getPostContent());
    post.setPostPhoto1(postUpdateDto.getPostPhoto1());
    post.setPostPhoto2(postUpdateDto.getPostPhoto2());
    post.setMeetingPlace(postUpdateDto.getMeetingPlace());
    post.setMeetingTime(postUpdateDto.getMeetingTime());
    post.setAddress(post.getUser().getUserAddress());

    String postTitle = String.format("[%s/%s] %s -> %s",
        post.getTradeType().getDescription(),
        post.getUser().getUserAddress(),
        writerFoodName,
        proposerFoodName);
    post.setPostTitle(postTitle);

    post.setWriterFood(writerFood.get());
    post.setProposerFoodList(foodList.get());

    postRepository.save(post);

    return PostDetailDto.of(post, post.getUser());
  }

  public void deletePost(Long userId, Long postId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new PostNotFoundException("게시글을 찾을 수 없습니다."));

    if (! post.getUser().getUserId().equals(userId)) {
      throw new UnauthorizedException("게시글 삭제 권한이 없습니다.");
    }

    postRepository.deleteById(postId);
  }
}
