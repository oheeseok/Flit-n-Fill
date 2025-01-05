package org.example.backend.api.notification.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.notification.service.PushNotificationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/subscribe")
@RequiredArgsConstructor
@Slf4j
public class PushNotificationController {
  private final PushNotificationService pushNotificationService;
  @Value("${server.host}") String origin;

  // SSE 연결을 시작하는 엔드포인트
  @GetMapping(value = "/{userEmail}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter subscribe(@PathVariable("userEmail") String userEmail, HttpServletResponse response) {

    response.setHeader("Access-Control-Allow-Origin", "http://" + origin);
    return pushNotificationService.subscribe(userEmail);
  }

  // 구독 취소 엔드포인트 (Unsubscribe)
  @DeleteMapping("/{userEmail}")
  public ResponseEntity<Void> unsubscribe(@PathVariable("userEmail") String userEmail) {
    pushNotificationService.unsubscribe(userEmail);
    return ResponseEntity.noContent().build(); // 204 No Content 응답 반환
  }

}
