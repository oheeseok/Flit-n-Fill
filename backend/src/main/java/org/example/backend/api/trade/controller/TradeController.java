package org.example.backend.api.trade.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.backend.api.trade.model.dto.TradeRoomMessageDto;
import org.example.backend.api.trade.service.TradeService;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
public class TradeController {
    private final TradeService tradeService;

    @GetMapping
    public ResponseEntity<?> getTradeRoomList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(tradeService.getAllTrades(userId));
    }

    @GetMapping("/{tradeRoodId}")
    public ResponseEntity<?> getTradeRoomDetail(HttpServletRequest request, @PathVariable("tradeRoomId") String tradeRoomId) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }

        return ResponseEntity.status(HttpStatus.OK).body(tradeService.getTradeRoomDetailDto(tradeRoomId, userId));
    }

    @PostMapping("/{tradeRoomId}")
    public ResponseEntity<?> addMessage(HttpServletRequest request, @PathVariable("tradeRoomId") String tradeRoomId,
                                        String message) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        TradeRoomMessageDto addedMessage = tradeService.addMessage(tradeRoomId, userId, message);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedMessage);
    }

    @PatchMapping("/{tradeRoomId}")
    public ResponseEntity<?> changeTradeStatus(@PathVariable("tradeRoomId") String tradeRoomId,
                                                   String status) {
        // 상태 변경 처리
        tradeService.changeTradeStatus(tradeRoomId, status);

        // 거래 완료 시 만족도 평가 페이지로 리디렉션
        if ("COMPLETED".equals(status)) {
            URI feedbackUri = URI.create("/feedback"); // 만족도 평가 페이지 경로
            return ResponseEntity.status(HttpStatus.SEE_OTHER).location(feedbackUri).build();
        }

        return ResponseEntity.noContent().build(); // 기본적으로 204 반환
    }
}