package org.example.backend.api.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
public class NotificationService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final MyfridgeRepository myfridgeRepository;

    @Scheduled(cron = "0 0 6 * * *")    // 매일 오전 6시에 발송 (소비기한 임박한 재료 안내 메일)
    public void sendExpirationEmail() {
        List<User> userList = userRepository.findAll();
        for (User user : userList) {
            SimpleMailMessage msg = new SimpleMailMessage();
            StringBuilder content = new StringBuilder();
            LocalDate today = LocalDate.now();

            List<Food> foods = myfridgeRepository.findByUser(user);
            Map<Long, List<Food>> foodList = foods.stream()
                            .filter(food -> food.getFoodExpDate() != null && !food.getFoodExpDate().isBefore(today))
                            .collect(Collectors.groupingBy(food -> ChronoUnit.DAYS.between(today, food.getFoodExpDate())));
            foods.stream().sorted(Comparator.comparing(Food::getFoodExpDate));  // 소비기한 임박 순 정렬

            content.append("소비기한이 임박한 재료가 있어 안내드립니다.\n" +
                    "아래의 재료를 확인하시고 빠르게 사용해 주세요!\n\n");
//            msg.setTo(user.getUserEmail());    // 이메일 받을 주소
            msg.setTo("wjsrkgus0119@gmail.com");
            msg.setSubject("[소비기한 임박 알림]");
            for (long dday = 0 ; dday <= 3 ; dday++) {
                List<Food> groupedFoods = foodList.get(dday);
                if (groupedFoods != null && !groupedFoods.isEmpty()) {
                    content.append("=== 소비기한 D-" + dday + " ===\n");
                    groupedFoods.forEach(f -> content.append(f.getFoodListName())
                            .append(" (소비기한 : ").append(f.getFoodExpDate()).append(")\n"));
                    content.append("\n");
                }
            }
            msg.setText(content.toString());

            mailSender.send(msg);
        }
    }

}
