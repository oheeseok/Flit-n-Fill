package org.example.backend.api.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
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
      // 구독된 사용자 수 로그
      SseEmitter oldEmitter = emitters.remove(userEmail);
      if (oldEmitter != null) {
        oldEmitter.complete();
      }
      log.info("[SseEmitter] Removed existing subscription for user {}", userEmail);
      log.info("[SseEmitter] Current subscription count: {}", emitters.size());
//      return emitters.get(userEmail); // 기존 emitter 반환
    }

    // 새로운 Emitter 생성 및 등록
    // 구독이 안되어 있는 경우에만 새로운 emitter 생성
    long timeout = 1000L * 60 * 60; // sse emitter 연결 시간, 1시간

    SseEmitter emitter = new SseEmitter(timeout); // timeout마다 한번씩 연결 재요청을 보냄
    // 클라이언트와 서버 간의 연결이 활성 상태로 유지되는 최대 시간
    // 30초 동안 클라이언트로부터 추가적인 요청(keep-alive 등)이 없으면 연결이 자동으로 종료
    emitters.put(userEmail, emitter);
    log.info("[SseEmitter] New subscription for user {}, current sub count: {}", userEmail, emitters.size());

    // 연결이 완료되거나 오류가 발생하면 emitter를 제거
    emitter.onCompletion(() -> {
      if (emitters.containsKey(userEmail)) {
        emitters.remove(userEmail);
        log.info("[SseEmitter] emitter.onCompletion({}), current sub count: {}", userEmail, emitters.size());
      }
    });
    emitter.onTimeout(() -> {
      if (emitters.containsKey(userEmail)) {
        emitters.remove(userEmail);
        log.info("[SseEmitter] emitter.onTimeout({}), current sub count: {}", userEmail, emitters.size());
      }
    });
    emitter.onError((e) -> {
      if (emitters.containsKey(userEmail)) {
        emitters.remove(userEmail);
        log.info("[SseEmitter] SSE connection error for user {}: {}", userEmail, e.getMessage());
        log.info("[SseEmitter] Current subscription count after error: {}", emitters.size());
      }
    });

    try {
      emitter.send(SseEmitter.event()
          .name("connect")
          .data("connected")); //503 에러 방지를 위한 더미 데이터
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    return emitter;
  }

  // 구독 취소 메서드 (Unsubscribe)
  public void unsubscribe(String userEmail) {
    SseEmitter emitter = emitters.remove(userEmail);
    if (emitter != null) {
      emitter.complete(); // 연결 종료
      log.info("[SseEmitter] Connection closed for user {}", userEmail);
      log.info("[SseEmitter] Current subscription count after unsubscribe: {}", emitters.size());
    } else {
      log.warn("[SseEmitter] No subscription found for user {}", userEmail);
    }
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
        log.info("[SseEmitter] Current subscription count after sendPushNotification error: {}", emitters.size());
        return null; // 오류 발생 시 map에서 제거
      }
    });
    // 푸시 메시지를 보낼 때마다 구독 개수 출력
    log.info("[SseEmitter] Current subscription count before sending push message: {}", emitters.size());
  }
}
