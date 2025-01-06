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
import org.example.backend.api.s3.S3Service;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.api.trade.repository.TradeRequestRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.enums.Progress;
import org.example.backend.enums.TaskStatus;
import org.example.backend.enums.TradeType;
import org.example.backend.exceptions.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
  private final S3Service s3Service;

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

  public PostDetailDto addPost(Long userId, PostRegisterDto postRegisterDto, MultipartFile postMainPhoto) throws IOException {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

    String photoUrl = s3Service.uploadFile(postMainPhoto, "posts/main");
    postRegisterDto.setPostPhoto1(photoUrl);

    Post post = Post.of(user, postRegisterDto);
    // setWriterFood, setProposerFoodList 따로 하는 이유: myfridgeRepository, foodListRepository를 써야하기 때문

    Optional<Food> writerFood = myfridgeRepository.findById(postRegisterDto.getWriterFoodId());
    if (! writerFood.isPresent()) {
      throw new NoSuchElementException("Food does not exist with ID: " + postRegisterDto.getWriterFoodId());
    }
    post.setWriterFood(writerFood.get());

    if (postRegisterDto.getTradeType().equals(TradeType.EXCHANGE)) {  // 교환일 경우에만 foodList 검증
      Optional<FoodList> foodList = foodListRepository.findById(postRegisterDto.getProposerFoodListId());
      if (! foodList.isPresent()) {
        throw new NoSuchElementException("FoodList does not exist with ID: " + postRegisterDto.getProposerFoodListId());
      }
      post.setProposerFoodList(foodList.get());
    }

//    String writerFoodName = writerFood.get().getFoodListName();
//    String proposerFoodName = foodList.get().getFoodListType() == null ?
//        foodList.get().getFoodListProduct() :
//        foodList.get().getFoodListType();
//    log.info("[PostService.addPost] writerFoodName: {}, proposerFoodName: {}", writerFoodName, proposerFoodName);

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


  public PostDetailDto updatePost(Long userId, Long postId, PostUpdateDto postUpdateDto, MultipartFile postMainPhoto) throws IOException {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new PostNotFoundException("게시글을 찾을 수 없습니다."));

    if (! post.getUser().getUserId().equals(userId)) {
      throw new UnauthorizedException("게시글 수정 권한이 없습니다.");
    }

    Optional<Food> writerFood = myfridgeRepository.findById(postUpdateDto.getWriterFoodId());
    if (! writerFood.isPresent()) {
      throw new NoSuchElementException("Food does not exist with ID: " + postUpdateDto.getWriterFoodId());
    }

    if (postUpdateDto.getProposerFoodListId() != null) {  // 교환일 경우에만 foodList 검증
      Optional<FoodList> foodList = foodListRepository.findById(postUpdateDto.getProposerFoodListId());
      if (! foodList.isPresent()) {
        throw new NoSuchElementException("FoodList does not exist with ID: " + postUpdateDto.getProposerFoodListId());
      }
      post.setProposerFoodList(foodList.get());
      String proposerFoodName = foodList.get().getFoodListType() == null ?
          foodList.get().getFoodListProduct() :
          foodList.get().getFoodListType();
      post.setProposerFoodList(foodList.get());

    }

    if (postMainPhoto != null && !postMainPhoto.isEmpty()) {
      String oldPhotoUrl = post.getPostPhoto1();
      s3Service.deleteFile(oldPhotoUrl);
      String newPhotoUrl = s3Service.uploadFile(postMainPhoto, "posts/main");
      post.setPostPhoto1(newPhotoUrl);
    }

    String writerFoodName = writerFood.get().getFoodListName();

//    log.info("[PostService.updatePost] writerFoodName: {}, proposerFoodName: {}", writerFoodName, proposerFoodName);

    // 글 수정 시 교환, 나눔은 불변
    // 글 수정 시 사용자의 위치로 변경

    post.setPostTitle(postUpdateDto.getPostTitle());
    post.setPostContent(postUpdateDto.getPostContent());
    post.setPostPhoto2(postUpdateDto.getPostPhoto2());
    post.setMeetingPlace(postUpdateDto.getMeetingPlace());
    post.setMeetingTime(postUpdateDto.getMeetingTime());
    post.setAddress(post.getUser().getUserAddress());

    post.setWriterFood(writerFood.get());

    postRepository.save(post);

    return PostDetailDto.of(post, post.getUser());
  }

  public void deletePost(Long userId, Long postId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new PostNotFoundException("게시글을 찾을 수 없습니다."));

    if (! post.getUser().getUserId().equals(userId)) {
      throw new UnauthorizedException("게시글 삭제 권한이 없습니다.");
    }

    String postTitle = post.getPostTitle();
    TradeType tradeType = post.getTradeType();
    NotificationType notificationType = null;
    Progress progress = post.getProgress();

    if (tradeType.equals(TradeType.EXCHANGE)) {
      notificationType = NotificationType.TRADE_CANCEL;
    } else if (tradeType.equals(TradeType.SHARING)) {
      notificationType = NotificationType.SHARE_CANCEL;
    }
    List<TradeRequest> tradeRequestList = tradeRequestRepository.findByPost_PostId(postId);
    // 게시글에 대한 요청자가 없는 경우: 바로 삭제
    // 게시글에 대한 요청자들이 있는 경우: TradeRequest trade_task_status = 거절 🡪 요청자들에게 알림(TRADE_CANCEL / SHARE_CANCEL) 전송 후 삭제
    if (tradeRequestList == null) {
      postRepository.deleteById(postId);
    } else {
      if (progress.equals(Progress.IN_PROGRESS)) {
        // 삭제 불가
        throw new PostCannotBeDeletedException("진행중인 거래가 있으므로 게시글을 삭제할 수 없습니다.");
      } else {
        for (TradeRequest tradeRequest : tradeRequestList) {
          User proposer = tradeRequest.getProposer(); // 요청자
          if (tradeRequest.getTradeTaskStatus().equals(TaskStatus.ACCEPTED)) {
            continue; // 거래 완료된 회원에게는 알림 전송 X
          }
          // db 저장
          notificationService.saveTradeRequestNotification(
              proposer,
              notificationType,
              "[" + postTitle + "] 게시글이 삭제되었습니다!",
              null,
              null
          );
        }
        String postMainPhoto = post.getPostPhoto1();
        String postPhoto2 = post.getPostPhoto2();
        if (postMainPhoto != null && !postMainPhoto.isEmpty()) {
          s3Service.deleteFile(postMainPhoto);
        }
        if (postPhoto2 != null && !postPhoto2.isEmpty()) {
          s3Service.deleteFile(postPhoto2);
        }

        postRepository.deleteById(postId);
      }
    }
  }

  public void createTradeRequest(Long proposerId, Long postId) {
    // email 전송, push 알림 전송, notification 테이블에 데이터 저장
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new NoSuchElementException("Post does not exist with ID: " + postId));

    User proposer = userRepository.findById(proposerId)
        .orElseThrow(() -> new UserNotFoundException("회원(요청자)을 찾을 수 없습니다."));

    User writer = userRepository.findById(post.getUser().getUserId())
        .orElseThrow(() -> new UserNotFoundException("회원(작성자)을 찾을 수 없습니다."));

    // 하나의 회원은 하나의 post에 요청하기를 한번만 할 수 있다.
    // 하나의 post는 여러 회원들에게서 요청을 받을 수 있다.

    // TradeRequest 테이블에 (post, proposer) 에 대한 행이 존재하는지 확인하고 최신 행 가져오기
    Optional<TradeRequest> byPostAndProposer = tradeRequestRepository.findFirstByPostAndProposerOrderByRequestCreatedDateDesc(post, proposer);
    TradeRequest tradeRequest = null;

    if (byPostAndProposer.isPresent()) { // proposer가 이미 요청한 경우
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
    } else { // proposer가 요청하지 않은 경우
      List<TradeRequest> byPostPostId = tradeRequestRepository.findByPost_PostId(postId);
      for (TradeRequest request : byPostPostId) {
        if (request.getTradeTaskStatus().equals(TaskStatus.ACCEPTED)) {
          log.info("> 이미 수락된 거래여서 요청 전송이 불가능합니다.");
          throw new TradeRequestHandleException("요청 전송이 불가능합니다. tradeTaskStatus = " + request.getTradeTaskStatus().getDescription());
        }
      }

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
    pushNotificationService.sendPushNotification(writer.getUserEmail(), message);
    log.info("2. send push --- done");

    // notification 테이블에 데이터 저장
    log.info("3. save data to db");
    NotificationType notificationType = post.getTradeType().equals(TradeType.EXCHANGE) ? NotificationType.TRADE_REQUEST : NotificationType.SHARE_REQUEST;
    notificationService.saveTradeRequestNotification(
        writer,
        notificationType,
        proposer.getUserNickname() + "님이 " + post.getTradeType().getDescription() + "을 요청합니다.",
        tradeRequest.getTradeRequestId(),
        null);
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

    if (! byPostAndProposer.isPresent()) {
      log.info("> 요청한 적 없는 요청이므로 요청 취소할 수 없습니다.");
      throw new TradeRequestHandleException("요청한 적 없는 요청이므로 요청 취소할 수 없습니다.");
    } else {
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
        pushNotificationService.sendPushNotification(writer.getUserEmail(), message);
        log.info("2. send push --- done");
      } else {
        log.info("> 요청 취소가 불가능합니다. tradeTaskStatus = {}", tradeTaskStatus.getDescription());
        throw new TradeRequestHandleException("요청 취소가 불가능합니다. tradeTaskStatus = " + tradeTaskStatus.getDescription());
      }
    }
  }

  public void handleTradeRequest(Long userId, Long postId, String action) {
    if (action.toLowerCase().equals("request")) {
      createTradeRequest(userId, postId);
    } else if (action.toLowerCase().equals("cancel")) {
      cancelTradeRequest(userId, postId);
    }
  }
}
