package org.example.backend.api.trade.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.notification.repository.NotificationRepository;
import org.example.backend.api.notification.service.NotificationService;
import org.example.backend.api.notification.service.PushNotificationService;
import org.example.backend.api.post.model.dto.PostSimpleDto;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.post.repository.PostRepository;
import org.example.backend.api.trade.model.dto.TradeRoomDetailDto;
import org.example.backend.api.trade.model.dto.TradeRoomMessageDto;
import org.example.backend.api.trade.model.dto.TradeRoomSimpleDto;
import org.example.backend.api.trade.model.entity.Kindness;
import org.example.backend.api.trade.model.entity.Trade;
import org.example.backend.api.trade.model.entity.TradeRoom;
import org.example.backend.api.trade.repository.KindnessRepository;
import org.example.backend.api.trade.repository.TradeRepository;
import org.example.backend.api.trade.repository.TradeRoomRepository;
import org.example.backend.api.user.model.dto.OtherUserDto;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.KindnessType;
import org.example.backend.enums.NotificationType;
import org.example.backend.enums.Progress;
import org.example.backend.exceptions.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TradeService {
    private final TradeRoomRepository tradeRoomRepository;
    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final KindnessRepository kindnessRepository;
    private final PushNotificationService pushNotificationService;
    private final NotificationRepository notificationRepository;
    public List<TradeRoomSimpleDto> getAllTrades(Long userId) {
        List<TradeRoom> tradeRoomList = tradeRoomRepository.findByWriterIdOrProposerId(userId, userId);
        List<TradeRoomSimpleDto> tradeRoomDtos = new ArrayList<>();

        for (TradeRoom tradeRoom : tradeRoomList) {
            TradeRoomSimpleDto simple = new TradeRoomSimpleDto();
            simple.setTradeRoomId(tradeRoom.getTradeRoomId());

            Trade trade = tradeRepository.findById((Long) tradeRoom.getTradeId())
                    .orElseThrow(() -> new TradeNotFoundException("해당하는 거래를 찾을 수 없습니다."));
            Post post = trade.getPost();
            User writer = post.getUser();
            User proposer = trade.getProposer();
            simple.setPostTitle(trade.getPost().getPostTitle());

            if (writer.getUserId() == userId) {
                simple.setOtherUserNickname(proposer.getUserNickname());
                simple.setOtherUserProfile(proposer.getUserProfile());
            } else {
                simple.setOtherUserNickname(writer.getUserNickname());
                simple.setOtherUserProfile(writer.getUserProfile());
            }

            // 마지막 메시지의 시간을 가져와서 설정
            List<TradeRoomMessageDto> messages = tradeRoom.getTradeRoomMessage();
            if (messages != null && !messages.isEmpty()) {
                TradeRoomMessageDto lastMessage = messages.get(messages.size() - 1); // 마지막 메시지
                simple.setLastMessageTime(lastMessage.getTime());
            } else {
                simple.setLastMessageTime(tradeRoom.getTradeRoomCreatedDate()); // 메시지가 없으면 생성시간으로 설정
            }

            tradeRoomDtos.add(simple);
        }
        return tradeRoomDtos;
    }

    public TradeRoomDetailDto getTradeRoomDetailDto(String tradeRoomId, Long userId) {
        // 거래방 조회
        TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래방을 찾을 수 없습니다."));

        // 거래 조회
        Trade trade = tradeRepository.findById(tradeRoom.getTradeId())
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래를 찾을 수 없습니다."));

        // 상대방 정보 조회
        Long otherUserId = tradeRoom.getProposerId().equals(userId) ? tradeRoom.getWriterId() : tradeRoom.getProposerId();
        User otherUser = userRepository.findById(otherUserId).orElse(null);
        User me = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다."));

        // DTO 생성
        TradeRoomDetailDto tradeRoomDetailDto = new TradeRoomDetailDto();
        tradeRoomDetailDto.setTradeRoomId(tradeRoom.getTradeRoomId());
        tradeRoomDetailDto.setTradeProgress(trade.getProgress());
        tradeRoomDetailDto.setOtherUserInfo(OtherUserDto.of(otherUser));
        tradeRoomDetailDto.setMyInfo(OtherUserDto.of(me));
        tradeRoomDetailDto.setTradeRoomMessage(tradeRoom.getTradeRoomMessage());

        // 게시글 정보 설정
        Post post = trade.getPost();
        tradeRoomDetailDto.setPostInfo(PostSimpleDto.of(post, post.getUser()));

        return tradeRoomDetailDto;
    }


    // 거래 생성
    public Trade createNewTrade(Notification notification) {
        Trade trade = new Trade();

        trade.setPost(notification.getTradeRequest().getPost());
        trade.setProposer(notification.getTradeRequest().getProposer());
        trade.setTradeCreatedDate(LocalDateTime.now());
        trade.setTradeUpdatedDate(LocalDateTime.now());

        return tradeRepository.save(trade);
    }

    // 거래방 생성
    public TradeRoom createNewTradeRoom(Trade trade) {
        TradeRoom tradeRoom = new TradeRoom();

        tradeRoom.setTradeRoomCreatedDate(LocalDateTime.now());
        tradeRoom.setTradeId(trade.getTradeId());
        tradeRoom.setWriterId(trade.getPost().getUser().getUserId());
        tradeRoom.setProposerId(trade.getProposer().getUserId());

        // 첫 번째 메시지 생성
        TradeRoomMessageDto firstMessage = new TradeRoomMessageDto();
        firstMessage.setTime(LocalDateTime.now());
        firstMessage.setUserId(trade.getPost().getUser().getUserId()); // userId 말고 관리자 메세지로 지정하도록 하겠읍니다..
        firstMessage.setComment("거래방이 생성되었습니다.");

        // 메시지를 리스트에 추가
        tradeRoom.setTradeRoomMessage(new ArrayList<>(List.of(firstMessage)));

        return tradeRoomRepository.save(tradeRoom);
    }

    public TradeRoomMessageDto addMessage(String tradeRoomId, Long userId, String message) {
        TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래방을 찾을 수 없습니다."));

        TradeRoomMessageDto messageDto = new TradeRoomMessageDto();
        messageDto.setTime(LocalDateTime.now());
        messageDto.setUserId(userId);
        messageDto.setComment(message);

        tradeRoom.getTradeRoomMessage().add(messageDto);
        tradeRoomRepository.save(tradeRoom);

        // 상대방 정보 조회
        Long otherUserId = tradeRoom.getProposerId().equals(userId) ? tradeRoom.getWriterId() : tradeRoom.getProposerId();
        User otherUser = userRepository.findById(otherUserId).orElse(null);
        User me = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다."));

        // push 알림
        log.info("2. send push noti");
        String notificationMessage = String.format("[%s] 거래방에 새 댓글이 작성되었습니다.",
            NotificationType.NEW_COMMENT.getDescription()
        );
        log.info("notificationMessage: {}", notificationMessage);
        pushNotificationService.sendPushNotification(otherUserId, notificationMessage);
        log.info("2. send push --- done");

        // db 저장
        saveMessageNotification(otherUser, NotificationType.NEW_COMMENT, tradeRoomId,"거래방에 새 댓글이 작성되었습니다.");

        return messageDto;
    }

    public void changeTradeStatus(String tradeRoomId, String status) {
        // 거래방 조회
        TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래방을 찾을 수 없습니다."));

        // 거래 조회
        Trade trade = tradeRepository.findById(tradeRoom.getTradeId())
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래를 찾을 수 없습니다."));

        Post post = trade.getPost();

        // 거래 상태 업데이트
        if (trade.getProgress().equals(Progress.COMPLETED)) {
            throw new IllegalStateException("이미 완료된 거래입니다.");
        } else if (status.equals("COMPLETED")) {
            trade.setProgress(Progress.COMPLETED);
            post.setProgress(Progress.COMPLETED);
        } else if (status.equals("CANCELED")) {
            trade.setProgress(Progress.CANCELED);
            post.setProgress(Progress.PENDING);
        }

        tradeRepository.save(trade);
        postRepository.save(post);
    }

    public void addKindness(String tradeRoomId, Long userId, String kindnessType) {
        Kindness kindness = new Kindness();

        Optional<Kindness> existingKindness = kindnessRepository.findByTradeRoomIdAndReviewer_UserId(tradeRoomId, userId);

        if (existingKindness.isPresent()) {
            throw new KindnessAlreadyReviewedException("이미 만족도 평가를 완료하였습니다.");
        }

        TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
                .orElseThrow(() -> new TradeRoomNotFoundException("해당하는 거래를 찾을 수 없습니다."));

        Trade trade = tradeRepository.findById(tradeRoom.getTradeId())
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래를 찾을 수 없습니다."));

        if (!trade.getProgress().equals(Progress.COMPLETED)) {
            throw new TradeNotCompletedException("거래가 완료되지 않아 Kindness를 추가할 수 없습니다.");
        }

        // 상대방 정보 조회
        Long otherUserId = tradeRoom.getProposerId().equals(userId) ? tradeRoom.getWriterId() : tradeRoom.getProposerId();
        User otherUser = userRepository.findById(otherUserId).orElseThrow(() -> new UserNotFoundException("탈퇴 유저에 대해 평가할 수 없습니다."));
        User me = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다."));

        kindness.setTradeRoomId(tradeRoomId);
        kindness.setReviewer(me);
        kindness.setReviewee(otherUser);
        kindness.setKindnessType(KindnessType.valueOf(kindnessType));

        kindnessRepository.save(kindness);
        calculateKindness(me, null);
        calculateKindness(otherUser, KindnessType.valueOf(kindnessType));
    }

    private void calculateKindness(User user, KindnessType kindnessType) {
        int exp = user.getUserExp();
        int level = user.getUserKindness();

        // 경험치 변경
        if (kindnessType == null) { // 만족도 평가 시 2점
            exp += 2;
        } else if (kindnessType.equals(KindnessType.GREAT)) { // 좋아요 평가 시 10점
            exp += 10;
        } else { // 별로예요 평가 시 -5점
            exp -= 5;
        }

        // 레벨 계산
        int newLevel = calculateLevel(exp);
        if (level < newLevel) {
            // push 알림
            String notificationMessage = String.format("[F-evel Up!] %s님이 %d f-evel 을 달성하였습니다!",
                user.getUserNickname(), newLevel);
            log.info("notificationMessage: {}", notificationMessage);
            pushNotificationService.sendPushNotification(user.getUserId(), notificationMessage);
            log.info("3. send push --- done");

            // db 저장
            saveMessageNotification(user, NotificationType.LEVEL_CHANGE, null, "f-evel이 상승했습니다!");
        } else if (level > newLevel) {
            // push 알림
            String notificationMessage = String.format("[F-evel Down] %s님이 %d f-evel 로 하락하였습니다. 후기를 남겨 f-evel을 올려보세요!",
                    user.getUserNickname(), newLevel);
            log.info("notificationMessage: {}", notificationMessage);
            pushNotificationService.sendPushNotification(user.getUserId(), notificationMessage);
            log.info("3. send push --- done");

            // db 저장
            saveMessageNotification(user, NotificationType.LEVEL_CHANGE, null, "f-evel이 하락했습니다ㅠㅠ");
        }

        // 유저 정보 업데이트
        user.setUserExp(exp);
        user.setUserKindness(newLevel);
        userRepository.save(user);
    }

    // 레벨 계산 로직
    private int calculateLevel(int exp) {
        if (exp < 50) return 0; // 레벨 0: 경험치 50 미만
        if (exp < 100) return 1; // 레벨 1: 경험치 50-99
        if (exp < 175) return 2; // 레벨 2: 경험치 100-174
        if (exp < 275) return 3; // 레벨 3: 경험치 175-274
        if (exp < 400) return 4; // 레벨 4: 경험치 275-399
        if (exp < 550) return 5; // 레벨 5: 경험치 400-549
        if (exp < 725) return 6; // 레벨 6: 경험치 550-724
        return 7; // 레벨 7: 경험치 725 이상
    }

    public void saveMessageNotification(User user, NotificationType type, String tradeRoomId, String message) {     // 거래방 새 댓글 알림
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setNotificationType(type);
        notification.setNotificationMessage(message);
        notification.setTradeRoomId(tradeRoomId);

        notificationRepository.save(notification);
    }
}
