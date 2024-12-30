//package org.example.backend.api.trade.controller;
//
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.RequiredArgsConstructor;
//import org.example.backend.api.trade.service.FeedbackService;
//import org.example.backend.exceptions.UserIdNullException;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/feedback")
//@RequiredArgsConstructor
//public class FeedbackController {
//  private final FeedbackService feedbackService;
//
//  @PostMapping("/{tradeRoomId}")
//  public ResponseEntity<String> updateMyFridge(HttpServletRequest request,
//                                               @PathVariable("tradeRoomId") String tradeRoomId,
//
//                                               ) {
//    Long userId = (Long) request.getAttribute("userId");
//    if (userId == null) {
//      throw new UserIdNullException("userId not found");
//    }
//    feedbackService.updateMyFridge(userId, tradeRoomId);
//    return ResponseEntity.noContent().build();
//  }
//
//  @GetMapping("/{tradeRoomId}")
//  public ResponseEntity<?> getTradeFoodInfo(HttpServletRequest request,
//                                       @PathVariable("tradeRoomId") String tradeRoomId,
//                                       @RequestParam(value = "role", required = true) String role,
//                                       @RequestParam(value = "type", required = true) String tradeType) {
//    Long userId = (Long) request.getAttribute("userId");
//    if (userId == null) {
//      throw new UserIdNullException("userId not found");
//    }
//
//    feedbackService.getTradeFoodInfo(userId, tradeRoomId, role, tradeType);
//  }
//}
