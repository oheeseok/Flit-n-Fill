package org.example.backend.api.notification.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.api.notification.service.PushNotificationService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/subscribe")
@RequiredArgsConstructor
public class PushNotificationController {
  private final PushNotificationService pushNotificationService;

  // SSE 연결을 시작하는 엔드포인트
  @GetMapping(value = "/{userEmail}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter subscribe(@PathVariable("userEmail") String userEmail) {
    return pushNotificationService.subscribe(userEmail);
  }
}
