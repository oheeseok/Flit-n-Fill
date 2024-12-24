package org.example.backend.api.trade.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.api.trade.service.TradeService;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
public class TradeController {
    private final TradeService tradeService;

    @GetMapping
    public ResponseEntity<?> getTradeList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(tradeService.getAllTrades(userId));
    }
//    @PatchMapping(""/{tradeRoomId}"")
//    public ResponseEntity<?> changeTradeStatus (@RequestBody String progress) {
//
//
//        return;
//    }
}