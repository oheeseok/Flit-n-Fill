package org.example.backend.api.post.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.foodlist.model.entity.FoodList;
import org.example.backend.api.foodlist.repository.FoodListRepository;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.notification.repository.NotificationRepository;
import org.example.backend.api.notification.service.EmailService;
import org.example.backend.api.notification.service.NotificationService;
import org.example.backend.api.notification.service.PushNotificationService;
import org.example.backend.api.post.model.dto.*;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.post.repository.PostRepository;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.api.trade.repository.TradeRequestRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.enums.TaskStatus;
import org.example.backend.enums.TradeType;
import org.example.backend.exceptions.PostNotFoundException;
import org.example.backend.exceptions.TradeRequestHandleException;
import org.example.backend.exceptions.UnauthorizedException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
  private final TradeRequestRepository tradeRequestRepository;
  private final PushNotificationService pushNotificationService;
  private final NotificationService notificationService;
  private final EmailService emailService;
  private final NotificationRepository notificationRepository;

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
    List<Post> posts = postRepository.findByKeyword(keyword);
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
    // setWriterFood, setProposerFoodList 따로 하는 이유: myfridgeRepository, foodListRepository를 써야하기 때문

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

    if (! post.getUser().getUserId().equals(userId)) {
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

    post.setPostTitle(postUpdateDto.getPostTitle());
    post.setPostContent(postUpdateDto.getPostContent());
    post.setPostPhoto1(postUpdateDto.getPostPhoto1());
    post.setPostPhoto2(postUpdateDto.getPostPhoto2());
    post.setMeetingPlace(postUpdateDto.getMeetingPlace());
    post.setMeetingTime(postUpdateDto.getMeetingTime());
    post.setAddress(post.getUser().getUserAddress());

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

  public void createTradeRequest(Long proposerId, Long postId) {
    // email 전송, push 알림 전송, notification 테이블에 데이터 저장
      Post post = postRepository.findById(postId)
              .orElseThrow(() -> new NoSuchElementException("Post does not exist with ID: " + postId));

      User proposer = userRepository.findById(proposerId)
              .orElseThrow(() -> new UserNotFoundException("회원(요청자)을 찾을 수 없습니다."));

      User writer = userRepository.findById(post.getUser().getUserId())
              .orElseThrow(() -> new UserNotFoundException("회원(작성자)을 찾을 수 없습니다."));

      // TradeRequest 테이블에 (post, proposer) 에 대한 행이 존재하는지 확인하고 최신 행 가져오기
      Optional<TradeRequest> byPostAndProposer = tradeRequestRepository.findFirstByPostAndProposerOrderByRequestCreatedDateDesc(post, proposer);

      TradeRequest tradeRequest = null;

      if (byPostAndProposer.isPresent()) {
        // trade_task_status가 ACCEPTED 또는 PENDING 이면 요청 불가능. return
          TaskStatus tradeTaskStatus = byPostAndProposer.get().getTradeTaskStatus();
        if (tradeTaskStatus.equals(TaskStatus.ACCEPTED) || tradeTaskStatus.equals(TaskStatus.PENDING)) {
          log.info("> 요청 전송이 불가능합니다. tradeTaskStatus = {}", tradeTaskStatus.getDescription());
          throw new TradeRequestHandleException("요청 전송이 불가능합니다. tradeTaskStatus = " + tradeTaskStatus.getDescription());
        } else if (tradeTaskStatus.equals(TaskStatus.DENIED)) {
            // trade_task_status가 DENIED 이면 요청 전송 가능
            tradeRequest = byPostAndProposer.get();
            tradeRequest.setTradeTaskStatus(TaskStatus.PENDING);
        }
      }
      else {
          // 첫 요청인 경우, 요청 전송 가능
          // TradeRequest 생성
          tradeRequest = new TradeRequest(
                  null,
                  post,
                  proposer,
                  TaskStatus.PENDING,
                  LocalDateTime.now()
          );
      }
      tradeRequestRepository.save(tradeRequest);

      // email 전송
      log.info("1. send email");
      emailService.sendTradeRequestEmail(writer.getUserId(), proposerId, postId);
      log.info("1. send email --- done");

      // push 알림 전송
      log.info("2. send push noti");

      String message = String.format("[%s 요청 알림] %s 님이 %s을 요청합니다.",
              post.getTradeType().getDescription(),
              proposer.getUserNickname(),
              post.getTradeType().getDescription());
      log.info("message: {}", message);
      pushNotificationService.sendPushNotification(writer.getUserId(), message);
      log.info("2. send push --- done");

      // notification 테이블에 데이터 저장
      log.info("3. save data to db");
      NotificationType notificationType = post.getTradeType().equals(TradeType.EXCHANGE) ? NotificationType.TRADE_REQUEST : NotificationType.SHARE_REQUEST;
      notificationService.saveTradeRequestNotification(
              writer,
              notificationType,
              post.getTradeType().getDescription() + " 요청이 왔습니다!",
              tradeRequest.getTradeRequestId());
      log.info("3. save data to db --- done");
  }

  public void cancelTradeRequest(Long proposerId, Long postId) {
    // writer가 proposer의 요청을 수락하기 전에 취소 가능
      Post post = postRepository.findById(postId)
              .orElseThrow(() -> new NoSuchElementException("Post does not exist with ID: " + postId));

      User proposer = userRepository.findById(proposerId)
              .orElseThrow(() -> new UserNotFoundException("회원(요청자)을 찾을 수 없습니다."));

      User writer = userRepository.findById(post.getUser().getUserId())
              .orElseThrow(() -> new UserNotFoundException("회원(작성자)을 찾을 수 없습니다."));

      // TradeRequest 테이블에 (post, proposer) 에 대한 행이 존재하는지 확인
      // TradeRequest 테이블에 (post, proposer) 에 대한 행이 존재하는지 확인하고 최신 행 가져오기
      Optional<TradeRequest> byPostAndProposer = tradeRequestRepository.findFirstByPostAndProposerOrderByRequestCreatedDateDesc(post, proposer);

      if (!byPostAndProposer.isPresent()) {
        log.info("> 요청한 적 없는 요청이므로 요청 취소할 수 없습니다.");
        throw new TradeRequestHandleException("요청한 적 없는 요청이므로 요청 취소할 수 없습니다.");
      }
      else {
        TradeRequest tradeRequest = byPostAndProposer.get();
        TaskStatus tradeTaskStatus = tradeRequest.getTradeTaskStatus();
        if (tradeTaskStatus.equals(TaskStatus.PENDING)) { // 취소 가능
          // 알림 뱃지에서 해당 요청 삭제
          List<Notification> byTradeRequest = notificationRepository.findByTradeRequest(tradeRequest);
          for (Notification notification : byTradeRequest) {
            notificationRepository.delete(notification);
          }
          // 요청 삭제
          tradeRequestRepository.delete(tradeRequest);

          // email 알림
          String subject = "[" + post.getTradeType().getDescription() + "요청 취소 알림]";
          StringBuilder content = new StringBuilder();
          content.append("<h3>" + proposer.getUserNickname() + "님이 " + post.getTradeType().getDescription() + " 요청을 취소하였습니다.</h3><br>");
          
          emailService.sendEmail(writer.getUserEmail(), subject, content.toString());

          // push 알림
          log.info("2. send push noti");
          String message = String.format("[%s 요청 취소 알림] %s님이 %s 요청을 취소하였습니다.",
              post.getTradeType().getDescription(),
              proposer.getUserNickname(),
              post.getTradeType().getDescription()
          );
          log.info("message: {}", message);
          pushNotificationService.sendPushNotification(writer.getUserId(), message);
          log.info("2. send push --- done");
        }
        else {
          log.info("> 요청 취소가 불가능합니다. tradeTaskStatus = {}", tradeTaskStatus.getDescription());
          throw new TradeRequestHandleException("요청 취소가 불가능합니다. tradeTaskStatus = " + tradeTaskStatus.getDescription());
        }
      }
  }

  public void handleTradeRequest(Long userId, Long postId, String action) {
    if (action.toLowerCase().equals("request")) {
      log.info(">> 게시글 - 요청하기");
      createTradeRequest(userId, postId);
    } else if (action.toLowerCase().equals("cancel")) {
      log.info(">> 게시글 - 요청 취소하기");
      cancelTradeRequest(userId, postId);
    }
  }


}
