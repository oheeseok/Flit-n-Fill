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
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@EnableScheduling
public class NotificationService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final MyfridgeRepository myfridgeRepository;
    private final NotificationRepository notificationRepository;

    @Value("${server.host}")
    private String host;

    @Value("${server.port}")
    private String port;

    @Scheduled(cron = "0 0 6 * * *")    // 매일 오전 6시에 발송 (소비기한 임박한 재료 안내 메일)
    public void sendExpirationEmail() {
        MimeMessage message = mailSender.createMimeMessage();
        List<User> userList = userRepository.findAll();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            for (User user : userList) {
                StringBuilder content = new StringBuilder();
                LocalDate today = LocalDate.now();

                // 소비기한 3일 이하 남은 food 필터링
                List<Food> foods = myfridgeRepository.findByUser(user);
                foods.stream().sorted(Comparator.comparing(Food::getFoodExpDate));  // 소비기한 임박 순 정렬
                Map<Long, List<Food>> foodList = foods.stream()
                        .filter(food -> food.getFoodExpDate() != null)
                        .filter(food -> ChronoUnit.DAYS.between(today, food.getFoodExpDate()) >= 0)
                        .filter(food -> ChronoUnit.DAYS.between(today, food.getFoodExpDate()) <= 3)
                        .collect(Collectors.groupingBy(food -> ChronoUnit.DAYS.between(today, food.getFoodExpDate())));

                content.append("<h3>소비기한이 임박한 재료가 있어 안내드립니다.</h3>" +
                        "<h3>아래의 재료를 확인하시고 빠르게 사용해 주세요!</h3><br>");
                for (long dday = 0 ; dday <= 3 ; dday++) {

                    List<Food> groupedFoods = foodList.get(dday);
                    if (groupedFoods != null && !groupedFoods.isEmpty()) {
                        if (dday == 0) {
                            content.append("<h3><strong>=== 소비기한 D-DAY ===</strong></h3>");
                        } else {
                            content.append("<h3><strong>=== 소비기한 D-" + dday + " ===</strong></h3>");
                        }
                        groupedFoods.forEach(f -> content.append("<p><strong>" + f.getFoodListName() + "</strong>")
                                .append(" (소비기한 : <span style='color: red;'>").append(f.getFoodExpDate()).append("</span>)</p>"));
                        content.append("<br>");
                    }
                }
                content.append("<strong><a href=\"http://" + host + ":" + port + "/api/recipes\" target=\"_blank\">추천 레시피 보러가기</a></strong>");

                if (!foodList.isEmpty()) {
                    helper.setTo(user.getUserEmail());    // 이메일 받을 주소
//                    helper.setTo("wjsrkgus0119@gmail.com");
                    helper.setSubject("[소비기한 임박 알림]");
                    helper.setText(content.toString(), true);
                    mailSender.send(message);

                    Notification notification = new Notification(
                            null,
                            user,
                            NotificationType.EXPIRATION,
                            "냉장고에서 확인해주세요",
                            null,
                            null,
                            false
                    );
                    notificationRepository.save(notification);
                }
            }
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 실패", e);
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


    public SseEmitter sendExpirationPush() {

    }
}
