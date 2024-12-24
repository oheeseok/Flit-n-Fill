package org.example.backend.api.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
import org.example.backend.api.notification.model.dto.NotificationViewDto;
import org.example.backend.api.notification.repository.NotificationRepository;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.post.repository.PostRepository;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.api.trade.repository.TradeRequestRepository;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.RequestRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.enums.TaskStatus;
import org.example.backend.enums.TradeType;
import org.example.backend.exceptions.RequestNotFoundException;
import org.example.backend.exceptions.TradeRequestHandleException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@EnableScheduling
public class NotificationService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final RequestRepository requestRepository;
    private final TradeRequestRepository tradeRequestRepository;
    private final EmailService emailService;
    private final PushNotificationService pushNotificationService;

    @Value("${server.host}")
    private String host;

    @Value("${server.port}")
    private String port;

    public void saveTradeRequestNotification(User user, NotificationType type, String message, Long tradeRequestId) {   // 교환, 나눔 요청 시 알림
        TradeRequest tradeRequest = tradeRequestRepository.findById(tradeRequestId).orElseThrow(() -> new RequestNotFoundException("tradeRequest not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setNotificationType(type);
        notification.setNotificationMessage(message);
        notification.setTradeRequest(tradeRequest);

        notificationRepository.save(notification);
    }

    public void saveRequestNotification(User user, NotificationType type, String message, Long requestId) {     // 재료추가 or 신고 요청 시 알림
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new RequestNotFoundException("request not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setNotificationType(type);
        notification.setNotificationMessage(message);
        notification.setRequest(request);

        notificationRepository.save(notification);
    }

    public void handelRequestNotification(Long userId, Long notificationId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        // Notification -> TradeRequest -> TradeTaskStatus 변경
        Notification notification = notificationRepository.findByNotificationId(notificationId);
        Long tradeRequestId = notification.getTradeRequest().getTradeRequestId();
        TradeRequest tradeRequest = tradeRequestRepository.findById(tradeRequestId)
                .orElseThrow(() -> new RequestNotFoundException("tradeRequest not found"));

        TaskStatus taskStatus = TaskStatus.valueOf(status);
        tradeRequest.setTradeTaskStatus(taskStatus);    // ACCEPTED or DENIED
        tradeRequestRepository.save(tradeRequest);

        User proposer = userRepository.findById(tradeRequest.getProposer().getUserId())
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        Long postId = tradeRequest.getPost().getPostId();
        String stat = notification.getNotificationType().getDescription();
        String subject = "[" + stat + " 결과 알림]";
        StringBuilder content = new StringBuilder();

        if (tradeRequest.getTradeTaskStatus().equals(TaskStatus.DENIED)) {  // 거절
            // email 전송(#54)
            content.append("<h3>회원님께서 요청하신 " + stat + "이 상대방에 의해 거절되었습니다.</h3><br>" +
                    stat + "한 게시글 : " + "<strong><a href=\"http://" + host + ":" + port + "/api/posts/" + postId + "\">게시글 보러가기</a></strong><br><br>");
            content.append("아쉽게도 요청이 거절되었지만, 재요청 하시거나 다른 거래를 시도해 보실 수 있습니다.<br>" +
                    "다른 게시글에도 교환 요청을 보내보세요!<br>" +
                    "<strong><a href=\"http://" + host + ":" + port + "/api/posts\">게시글 둘러보기</a></strong>");

            emailService.sendEmail(proposer.getUserEmail(), subject, content.toString());
            // push 알림(#55)
            log.info("2. send push noti");
            String message = String.format("[%s 결과 알림] 회원님께서 요청하신 %s이 거절되었습니다.",
                    stat,
                    stat
                );
            log.info("message: {}", message);
            pushNotificationService.sendPushNotification(proposer.getUserId(), message);
            log.info("2. send push --- done");

            // db 저장
            if (notification.getNotificationType().equals(NotificationType.TRADE_REQUEST)) {    // 교환 요청
                saveTradeRequestNotification(
                        proposer,
                        NotificationType.TRADE_REQUEST_RESULT,
                        stat + " : 거절되었습니다!",
                        tradeRequestId);
            } else if (notification.getNotificationType().equals(NotificationType.SHARE_REQUEST)) {     // 나눔 요청
                saveTradeRequestNotification(
                        proposer,
                        NotificationType.SHARE_REQUEST_RESULT,
                        stat + " : 거절되었습니다!",
                        tradeRequestId);
            } else {
                throw new TradeRequestHandleException("요청에 대한 결과가 아닙니다.");
            }
        } else if (tradeRequest.getTradeTaskStatus().equals(TaskStatus.ACCEPTED)) {    // 수락
            // email 전송(#54)
            content.append("<h3>회원님께서 요청하신 " + stat + "이 수락되었습니다!</h3><br>" +
                    stat + "한 게시글 : " + "<strong><a href=\"http://" + host + ":" + port + "/api/posts/" + postId + "\">게시글 보러가기</a></strong>");

            emailService.sendEmail(proposer.getUserEmail(), subject, content.toString());
            // push 알림(#55)
            log.info("2. send push noti");
            String message = String.format("[%s 결과 알림] 회원님께서 요청하신 %s이 수락되었습니다.",
                    stat,
                    stat
            );
            log.info("message: {}", message);
            pushNotificationService.sendPushNotification(proposer.getUserId(), message);
            log.info("2. send push --- done");

            // db 저장
            if (notification.getNotificationType().equals(NotificationType.TRADE_REQUEST)) {    // 교환 요청
                saveTradeRequestNotification(
                        proposer,
                        NotificationType.TRADE_REQUEST_RESULT,
                        stat + " : 수락되었습니다!",
                        tradeRequestId);
            } else if (notification.getNotificationType().equals(NotificationType.SHARE_REQUEST)) {     // 나눔 요청
                saveTradeRequestNotification(
                        proposer,
                        NotificationType.SHARE_REQUEST_RESULT,
                        stat + " : 수락되었습니다!",
                        tradeRequestId);
            } else {
                throw new TradeRequestHandleException("요청에 대한 결과가 아닙니다.");
            }
        } else {
            throw new TradeRequestHandleException("요청 대기 중입니다.");
        }
    }

    public List<NotificationViewDto> getAllNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        List<NotificationViewDto> notificationsList = notificationRepository.findByUser(user).stream()
                .map(n -> NotificationViewDto.of(n))
                .collect(Collectors.toList());
        return notificationsList;
    }

    public void readAllNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByUser(user);
        for (Notification notification : notifications) {
            notification.setNotificationIsRead(true);
            notificationRepository.save(notification);
        }
    }

    public void deleteAllNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByUser(user);
        notificationRepository.deleteAll(notifications);
    }

    public void deleteOneNotification(Long userId, Long notificationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        Notification notification = notificationRepository.findByNotificationId(notificationId);
        notificationRepository.delete(notification);
    }

}
