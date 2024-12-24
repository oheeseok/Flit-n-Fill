package org.example.backend.api.trade.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.trade.model.dto.TradeRoomMessageDto;
import org.example.backend.api.trade.model.dto.TradeRoomSimpleDto;
import org.example.backend.api.trade.model.entity.Trade;
import org.example.backend.api.trade.model.entity.TradeRoom;
import org.example.backend.api.trade.repository.TradeRepository;
import org.example.backend.api.trade.repository.TradeRoomRepository;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.TradeNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TradeService {
    private final TradeRoomRepository tradeRoomRepository;
    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;

    public List<TradeRoomSimpleDto> getAllTrades(Long userId) {
        List<TradeRoom> tradeRoomList = tradeRoomRepository.findByWriterIdOrProposerId(userId, userId);
        List<TradeRoomSimpleDto> tradeRoomDtos = new ArrayList<>();

        for (TradeRoom tradeRoom : tradeRoomList) {
            TradeRoomSimpleDto simple = new TradeRoomSimpleDto();
            simple.setTradeRoomId(tradeRoom.getTradeRoomId());

            Trade trade = tradeRepository.findById((Long) tradeRoom.getTradeId())
                    .orElseThrow(() -> new TradeNotFoundException("해당하는 거래를 찾을 수 없습니다."));
            Post post = trade.getPost();
            User writer = post.getUser();
            User proposer = trade.getProposer();
            simple.setPostTitle(trade.getPost().getPostTitle());

            if (writer.getUserId() == userId) {
                simple.setOtherUserNickname(proposer.getUserNickname());
                simple.setOtherUserProfile(proposer.getUserProfile());
            } else {
                simple.setOtherUserNickname(writer.getUserNickname());
                simple.setOtherUserProfile(writer.getUserProfile());
            }

            // 마지막 메시지의 시간을 가져와서 설정
            List<TradeRoomMessageDto> messages = tradeRoom.getTradeRoomMessage();
            if (messages != null && !messages.isEmpty()) {
                TradeRoomMessageDto lastMessage = messages.get(messages.size() - 1); // 마지막 메시지
                simple.setLastMessageTime(lastMessage.getTime());
            } else {
                simple.setLastMessageTime(tradeRoom.getTradeRoomCreatedDate()); // 메시지가 없으면 생성시간으로 설정
            }

            tradeRoomDtos.add(simple);
        }
        return tradeRoomDtos;
    }

    // 거래 생성
    public Trade createNewTrade(Notification notification) {
        Trade trade = new Trade();

        trade.setPost(notification.getTradeRequest().getPost());
        trade.setProposer(notification.getTradeRequest().getProposer());
        trade.setTradeCreatedDate(LocalDateTime.now());
        trade.setTradeUpdatedDate(LocalDateTime.now());

        return tradeRepository.save(trade);
    }

    // 거래방 생성
    public TradeRoom createNewTradeRoom(Trade trade) {
        TradeRoom tradeRoom = new TradeRoom();

        tradeRoom.setTradeRoomCreatedDate(LocalDateTime.now());
        tradeRoom.setTradeId(trade.getTradeId());
        tradeRoom.setWriterId(trade.getPost().getUser().getUserId());
        tradeRoom.setProposerId(trade.getProposer().getUserId());

        // 첫 번째 메시지 생성
        TradeRoomMessageDto firstMessage = new TradeRoomMessageDto();
        firstMessage.setTime(LocalDateTime.now());
        firstMessage.setUserId(trade.getPost().getUser().getUserId()); // userId 말고 관리자 메세지로 지정하도록 하겠읍니다..
        firstMessage.setComment("거래방이 생성되었습니다.");

        // 메시지를 리스트에 추가
        tradeRoom.setTradeRoomMessage(new ArrayList<>(List.of(firstMessage)));

        return tradeRoomRepository.save(tradeRoom);
    }
}