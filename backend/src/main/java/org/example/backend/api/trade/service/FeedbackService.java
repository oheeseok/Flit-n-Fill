//package org.example.backend.api.trade.service;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.example.backend.api.foodlist.model.entity.FoodList;
//import org.example.backend.api.myfridge.model.entity.Food;
//import org.example.backend.api.myfridge.repository.MyfridgeRepository;
//import org.example.backend.api.myfridge.service.MyfridgeService;
//import org.example.backend.api.post.model.entity.Post;
//import org.example.backend.api.trade.model.entity.Trade;
//import org.example.backend.api.trade.model.entity.TradeRoom;
//import org.example.backend.api.trade.repository.TradeRepository;
//import org.example.backend.api.trade.repository.TradeRoomRepository;
//import org.example.backend.api.user.model.entity.User;
//import org.example.backend.api.user.repository.UserRepository;
//import org.example.backend.enums.Progress;
//import org.example.backend.enums.TradeType;
//import org.example.backend.exceptions.*;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//@Slf4j
//public class FeedbackService {
//  public final TradeRoomRepository tradeRoomRepository;
//  private final TradeRepository tradeRepository;
//  private final MyfridgeService myfridgeService;
//  private final MyfridgeRepository myfridgeRepository;
//  private final UserRepository userRepository;
//
//  public void updateMyFridge(Long userId, String tradeRoomId) {
//    // tradeRoomId로 traderoom 찾기
//    TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
//        .orElseThrow(() -> new TradeRoomNotFoundException("거래방을 찾을 수 없습니다."));
//
//    Long writerId = tradeRoom.getWriterId();
//    Long proposerId = tradeRoom.getProposerId();
//
//    User writer = userRepository.findById(writerId)
//        .orElseThrow(() -> new UserNotFoundException("작성자가 존재하지 않습니다."));
//
//    User proposer = userRepository.findById(proposerId)
//        .orElseThrow(() -> new UserNotFoundException("요청자가 존재하지 않습니다."));
//
//    Trade trade = tradeRepository.findById(tradeRoom.getTradeId())
//        .orElseThrow(() -> new TradeNotFoundException("거래를 찾을 수 없습니다."));
//
//    if (! trade.getProgress().equals(Progress.COMPLETED)) {
//      throw new TradeNotCompletedException("거래가 완료되지 않아 재료를 수정할 수 없습니다.");
//    }
//
//    Post post = trade.getPost();
//    if (post == null) {
//      throw new PostNotFoundException("게시글을 찾을 수 없습니다."));
//    }
//
//    TradeType tradeType = post.getTradeType();
//    FoodList proposerFoodList = post.getProposerFoodList();
//    Food writerFood = post.getWriterFood();
//
//    // 교환일 경우
//    if (userId == proposerId) { // 내가 요청자 입장
//      Long foodListId = proposerFoodList.getFoodListId();
//      List<Food> proposerFoodList2 = myfridgeRepository.findByUserAndFoodList_FoodListId(proposer, foodListId); // foodListId와 일치하는 냉장고 아이템 리스트 조회
//
//    }
//
//    // 나눔일 경우
//
//
//  }
//
//  public Object getTradeFoodInfo(Long userId, String tradeRoomId, String role, String tradeType) {
//    // tradeType: EXCHANGE, role: proposer 인 경우:
//    //  given: proposerFoodListId와 일치하는 foodListId를 전부 조회해서 List로 반환
//    //  got: writerFoodId와 일치하는 food 반환
//
//    // tradeType: EXCHANGE, role: writer 인 경우: writerFoodId와 일치하는 food 반환
//    //  given: writerFoodId와 일치하는 food 반환
//    //  got: proposerFoodId와 일치하는 재료 DB 정보 반환
//
//    // tradeType: SHARING, role: proposer 인 경우: writerFoodId와 일치하는 food 반환
//    //  given: null
//    //  got: writerFoodId와 일치하는 food 반환
//
//    // tradeType: SHARING, role: writer 인 경우: writerFoodId와 일치하는 food 반환
//    //  given: writerFoodId와 일치하는 food 반환
//    //  got: null
//
//    // tradeRoomId로 traderoom 찾기
//    TradeRoom tradeRoom = tradeRoomRepository.findById(tradeRoomId)
//        .orElseThrow(() -> new TradeRoomNotFoundException("거래방을 찾을 수 없습니다."));
//
//    Trade trade = tradeRepository.findById(tradeRoom.getTradeId())
//        .orElseThrow(() -> new TradeNotFoundException("거래를 찾을 수 없습니다."));
//
//    if (! trade.getProgress().equals(Progress.COMPLETED)) {
//      throw new TradeNotCompletedException("거래가 완료되지 않아 재료를 수정할 수 없습니다.");
//    }
//
//    Post post = trade.getPost();
//    if (post == null) {
//      throw new PostNotFoundException("게시글을 찾을 수 없습니다."));
//    }
//
//    FoodList proposerFoodList = post.getProposerFoodList();
//    Food writerFood = post.getWriterFood();
//
//    if (tradeType.equals(TradeType.EXCHANGE.getDescription())) {
//      if (role.equals("proposer")) {
//
//      }
//    }
//  }
//}
