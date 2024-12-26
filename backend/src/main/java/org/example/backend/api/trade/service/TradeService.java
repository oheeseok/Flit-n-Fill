package org.example.backend.api.trade.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.post.model.dto.PostSimpleDto;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.post.repository.PostRepository;
import org.example.backend.api.trade.model.dto.TradeRoomDetailDto;
import org.example.backend.api.trade.model.dto.TradeRoomMessageDto;
import org.example.backend.api.trade.model.dto.TradeRoomSimpleDto;
import org.example.backend.api.trade.model.entity.Trade;
import org.example.backend.api.trade.model.entity.TradeRoom;
import org.example.backend.api.trade.repository.TradeRepository;
import org.example.backend.api.trade.repository.TradeRoomRepository;
import org.example.backend.api.user.model.dto.OtherUserDto;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.Progress;
import org.example.backend.exceptions.TradeNotFoundException;
import org.example.backend.exceptions.UserNotFoundException;
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
    private final PostRepository postRepository;

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

    public TradeRoomDetailDto getTradeRoomDetailDto(String tradeRoomId, Long userId) {
        // 거래방 조회
        TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래방을 찾을 수 없습니다."));

        // 거래 조회
        Trade trade = tradeRepository.findById(tradeRoom.getTradeId())
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래를 찾을 수 없습니다."));

        // 상대방 정보 조회
        Long otherUserId = tradeRoom.getProposerId().equals(userId) ? tradeRoom.getWriterId() : tradeRoom.getProposerId();
        User otherUser = userRepository.findById(otherUserId).orElse(null);
        User me = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없습니다."));

        // DTO 생성
        TradeRoomDetailDto tradeRoomDetailDto = new TradeRoomDetailDto();
        tradeRoomDetailDto.setTradeRoomId(tradeRoom.getTradeRoomId());
        tradeRoomDetailDto.setTradeProgress(trade.getProgress());
        tradeRoomDetailDto.setOtherUserInfo(OtherUserDto.of(otherUser));
        tradeRoomDetailDto.setMyInfo(OtherUserDto.of(me));
        tradeRoomDetailDto.setTradeRoomMessage(tradeRoom.getTradeRoomMessage());

        // 게시글 정보 설정
        Post post = trade.getPost();
        tradeRoomDetailDto.setPostInfo(PostSimpleDto.of(post, post.getUser()));

        return tradeRoomDetailDto;
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

    public TradeRoomMessageDto addMessage(String tradeRoomId, Long userId, String message) {
        TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래방을 찾을 수 없습니다."));

        TradeRoomMessageDto messageDto = new TradeRoomMessageDto();
        messageDto.setTime(LocalDateTime.now());
        messageDto.setUserId(userId);
        messageDto.setComment(message);

        tradeRoom.getTradeRoomMessage().add(messageDto);
        tradeRoomRepository.save(tradeRoom);

        return messageDto;
    }

    public void changeTradeStatus(String tradeRoomId, String status) {
        // 거래방 조회
        TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래방을 찾을 수 없습니다."));

        // 거래 조회
        Trade trade = tradeRepository.findById(tradeRoom.getTradeId())
                .orElseThrow(() -> new TradeNotFoundException("해당하는 거래를 찾을 수 없습니다."));

        Post post = trade.getPost();

        // 거래 상태 업데이트
        if (trade.getProgress().equals(Progress.COMPLETED)) {
            throw new IllegalStateException("이미 완료된 거래입니다.");
        } else if (status.equals("COMPLETED")) {
            trade.setProgress(Progress.COMPLETED);
            post.setProgress(Progress.COMPLETED);
        } else if (status.equals("CANCELED")) {
            trade.setProgress(Progress.CANCELED);
            post.setProgress(Progress.PENDING);
        }

        tradeRepository.save(trade);
        postRepository.save(post);
    }
}
