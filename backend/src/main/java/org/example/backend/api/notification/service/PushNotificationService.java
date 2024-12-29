package org.example.backend.api.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {
  // 사용자별 SseEmitter를 관리하는 ConcurrentHashMap
  private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

  // 클라이언트가 SSE 연결을 구독하는 메서드
  public SseEmitter subscribe(Long userId) {
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // 0L: timeout 무제한
    emitters.put(userId, emitter);

    // 연결이 완료되거나 오류가 발생하면 emitter를 제거
    emitter.onCompletion(() -> emitters.remove(userId));
    emitter.onTimeout(() -> emitters.remove(userId));
    emitter.onError((e) -> {
      log.info("SSE connection error for user {}: {}", userId, e.getMessage());
      emitters.remove(userId);
    });

    return emitter;
  }

  // 특정 사용자에게 푸시 알림을 전송하는 메서드
  public void sendPushNotification(Long userId, String message) {
    emitters.computeIfPresent(userId, (id, emitter) -> {
      try {
        if (emitter != null) {
          emitter.send(SseEmitter.event().name("notification").data(message));
        }
        return emitter;
      } catch (IOException e) {
        log.warn("Connection lost for user {}: {}", userId, e.getMessage());
        emitters.remove(userId);
        return null; // 오류 발생 시 map에서 제거
      }
    });
  }
}
