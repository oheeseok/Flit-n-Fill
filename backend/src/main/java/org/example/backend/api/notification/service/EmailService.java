package org.example.backend.api.notification.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.notification.repository.NotificationRepository;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.post.repository.PostRepository;
import org.example.backend.api.trade.repository.TradeRequestRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.RequestRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.enums.TradeType;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
public class EmailService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final MyfridgeRepository myfridgeRepository;
    private final NotificationRepository notificationRepository;
    private final PostRepository postRepository;
    private final RequestRepository requestRepository;
    private final TradeRequestRepository tradeRequestRepository;

    @Value("${server.host}")
    private String host;

    @Value("${server.port}")
    private String port;

    public void sendEmail(String to, String subject, String content) {  // 이메일 전송
        try {
            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            
            message.setRecipients(MimeMessage.RecipientType.TO, to);    // 이메일 받을 주소
            message.setSubject(subject, "UTF-8");
            message.setContent(content, "text/html; charset=utf-8");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("이메일 전송 실패", e);
        }
    }

    @Scheduled(cron = "0 0 6 * * *")
    public void sendExpirationEmail() {
        List<User> userList = userRepository.findAll();

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
            content.append("<strong><a href=\"http://" + host + ":" + 5173 + "/api/recipes\" target=\"_blank\">추천 레시피 보러가기</a></strong>");

            if (!foodList.isEmpty()) {
                sendEmail(user.getUserEmail(), "[소비기한 임박 알림]", content.toString());

                Notification notification = new Notification(
                        null,
                        user,
                        NotificationType.EXPIRATION,
                        "냉장고에서 확인해주세요",
                        null,
                        null,
                        null,
                        false
                );
                notificationRepository.save(notification);
            }
        }
    }

    public void sendTradeRequestEmail(Long writerId, Long proposerId, Long postId) {    // 교환/나눔 요청 알림 메일
        User writer = userRepository.findById(writerId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));
        User proposer = userRepository.findById(proposerId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));
        Post post = postRepository.findById(postId).get();
        TradeType type = post.getTradeType();
        String subject = "";
        StringBuilder content = new StringBuilder();

        if (type.equals(TradeType.EXCHANGE)) {
            subject = "[교환 요청 알림]";
            content.append("<h3>회원님의 게시글에 대해 교환 요청이 접수되었습니다.</h3>" +
                    "<h3>자세한 내용은 아래 정보를 확인해 주세요!</h3><br>");
        } else if (type.equals(TradeType.SHARING)) {
            subject = "[나눔 요청 알림]";
            content.append("<h3>회원님의 게시글에 대해 나눔 요청이 접수되었습니다.</h3>" +
                    "<h3>자세한 내용은 아래 정보를 확인해 주세요!</h3><br>");
        }
        content.append("<strong><a href=\"http://" + host + ":" + 5173 + "/api/posts/" + postId + "\">게시글 보러가기</a></strong>");
        content.append("<br>요청자 : " + proposer.getUserNickname() + "님");

        sendEmail(writer.getUserEmail(), subject, content.toString());
    }

    // 교환/나눔 요청 결과 알림 메일

    // 신고 당한 알림 메일

    // 신고 결과 알림 메일

    //
}
