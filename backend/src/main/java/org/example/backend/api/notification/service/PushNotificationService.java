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
  private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

  // 클라이언트가 SSE 연결을 구독하는 메서드
  public SseEmitter subscribe(String userEmail) {
    // 이미 구독이 되어 있는 경우 기존 emitter를 반환
    if (emitters.containsKey(userEmail)) {
      log.info("[SseEmitter] Already subscribed for user {}", userEmail);
      return emitters.get(userEmail); // 기존 emitter 반환
    }

    // 구독이 안되어 있는 경우에만 새로운 emitter 생성
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // 0L: timeout 무제한
    emitters.put(userEmail, emitter);
    log.info("[SseEmitter] emitter.put({})", userEmail);

    // 연결이 완료되거나 오류가 발생하면 emitter를 제거
    emitter.onCompletion(() -> {
      emitters.remove(userEmail);
      log.info("[SseEmitter] emitter.onCompletion({})", userEmail);
    });
    emitter.onTimeout(() -> {
      emitters.remove(userEmail);
      log.info("[SseEmitter] emitter.onTimeout({})", userEmail);
    });
    emitter.onError((e) -> {
      log.info("[SseEmitter] SSE connection error for user {}: {}", userEmail, e.getMessage());
      emitters.remove(userEmail);
    });

    return emitter;
  }

  // 특정 사용자에게 푸시 알림을 전송하는 메서드
  public void sendPushNotification(String userEmail, String message) {
    emitters.computeIfPresent(userEmail, (id, emitter) -> {
      try {
        if (emitter != null) {
          emitter.send(SseEmitter.event().name("notification").data(message));
        }
        return emitter;
      } catch (IOException e) {
        log.warn("Connection lost for user {}: {}", userEmail, e.getMessage());
        emitters.remove(userEmail);
        return null; // 오류 발생 시 map에서 제거
      }
    });
  }
}
