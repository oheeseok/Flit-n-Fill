package org.example.backend.api.admin.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.api.notification.service.EmailService;
import org.example.backend.api.notification.service.NotificationService;
import org.example.backend.api.notification.service.PushNotificationService;
import org.example.backend.api.user.model.dto.AdminResponseDto;
import org.example.backend.api.user.model.dto.RequestDetailDto;
import org.example.backend.api.user.model.entity.BlackList;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.BlackListRepository;
import org.example.backend.api.user.repository.RequestRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.enums.RequestType;
import org.example.backend.enums.TaskStatus;
import org.example.backend.exceptions.RequestNotFoundException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final PushNotificationService pushNotificationService;
    private final BlackListRepository blackListRepository;

    public List<RequestDetailDto> findAllRequests() {
        List<Request> requests = requestRepository.findAll();
        return requests.stream().map(RequestDetailDto::of).collect(Collectors.toList());
    }

    public RequestDetailDto findAnyRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException("Request not found"));
        return RequestDetailDto.of(request);
    }

    public RequestDetailDto updateRequestStatus(Long requestId, AdminResponseDto adminResponseDto) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RequestNotFoundException("Request not found"));

        TaskStatus taskStatus = TaskStatus.valueOf(adminResponseDto.getResponseStatus().toUpperCase());
        request.setResponseStatus(taskStatus);
        request.setResponseMessage(adminResponseDto.getResponseMessage());

        Request updated = requestRepository.save(request);

        // 요청 유형에 따른 분리된 처리
        if (request.getRequestType().equals(RequestType.ADD_FOOD)) {
            handleFoodRequest(request, taskStatus, adminResponseDto);
        } else if (request.getRequestType().equals(RequestType.REPORT)) {
            handleUserReport(request, taskStatus, adminResponseDto);
        } else {
            throw new IllegalArgumentException("Unsupported request type: " + request.getRequestType());
        }

        return RequestDetailDto.of(updated);
    }

    private void handleFoodRequest(Request request, TaskStatus taskStatus, AdminResponseDto adminResponseDto) {
        User user = userRepository.findById(request.getRequestUser().getUserId())
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));
        String subject = "[재료 추가 요청 결과 알림]";
        StringBuilder content = new StringBuilder();
        String message;

        if (taskStatus.equals(TaskStatus.ACCEPTED)) {   // 수락
            content.append("<h3>회원님께서 요청하신 재료가 추가되었습니다!</h3><br>" +
                    "요청하신 내용 : " + request.getRequestContent() +
                    "<br><br>지금 바로 냉장고에 등록하고 편리하게 관리해보세요!<br>" +
                    "재료 관리 페이지에서 추가된 재료를 확인하실 수 있습니다.");
            message = subject + " 회원님께서 요청하신 재료가 추가되었습니다!";
        } else if (taskStatus.equals(TaskStatus.DENIED)) {      // 거절
            content.append("<h3>회원님께서 요청하신 <strong>재료 추가 요청</strong>에 대한 처리 결과를 안내드립니다.</h3><br>" +
                    "요청하신 내용 : " + request.getRequestContent() +
                    "<br><br>아쉽게도 요청하신 내용은 다음과 같은 이유로 처리되지 않았습니다 : <br>" + "<strong>" + adminResponseDto.getResponseMessage() +
                    "</strong><br>이와 관련하여 추가적인 문의 사항이 있으시면 언제든지 고객센터로 문의해 주세요.");
            message = subject + " 회원님께서 요청하신 재료가 추가되지 않았습니다.";
        } else {
            throw new RequestNotFoundException("요청이 없거나 아직 대기상태입니다.");
        }

        emailService.sendEmail(user.getUserEmail(), subject, content.toString());
        pushNotificationService.sendPushNotification(user.getUserId(), message);

        notificationService.saveRequestNotification(
                user,
                NotificationType.FOOD_REQUEST_RESULT,
                "재료 추가 요청 결과 : " + taskStatus.getDescription() + "되었습니다!",
                request.getRequestId()
        );
    }

    private void handleUserReport(Request request, TaskStatus taskStatus, AdminResponseDto adminResponseDto) {
        User user = userRepository.findById(request.getRequestUser().getUserId())
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));
        String subject = "[신고 처리 결과 알림]";
        StringBuilder content = new StringBuilder();
        String message;

        if (taskStatus.equals(TaskStatus.ACCEPTED)) {   // 신고 수락
            content.append("<h3>회원님께서 신고하신 내용이 처리되었습니다.</h3><br>" +
                    "신고 내용 : " + request.getRequestContent() +
                    "<br><br>운영 정책에 따라 적절히 조치하였습니다.<br>" +
                    "처리 결과에 대한 문의는 고객센터를 통해 가능합니다.");
            message = subject + " 신고가 처리되었습니다.";

            // 신고 유저 처리


        } else if (taskStatus.equals(TaskStatus.DENIED)) {      // 신고 거절
            content.append("<h3>회원님께서 신고하신 <strong>내용</strong>에 대한 처리 결과를 안내드립니다.</h3><br>" +
                    "신고 내용 : " + request.getRequestContent() +
                    "<br><br>아쉽게도 운영 정책에 따라 해당 내용은 조치 대상이 아니라고 판단되었습니다.<br>" +
                    "관련하여 추가 문의 사항이 있으시면 고객센터로 문의해 주세요.");
            message = subject + " 신고가 처리되지 않았습니다.";
        } else {
            throw new RequestNotFoundException("요청이 없거나 아직 대기상태입니다.");
        }

        emailService.sendEmail(user.getUserEmail(), subject, content.toString());
        pushNotificationService.sendPushNotification(user.getUserId(), message);

        notificationService.saveRequestNotification(
                user,
                NotificationType.REPORT_RESULT,
                "신고 처리 결과 : " + taskStatus.getDescription() + "되었습니다!",
                request.getRequestId()
        );
    }

    public void addBlackList(User reportedUser) {
        Optional<BlackList> byUser = blackListRepository.findByUser(reportedUser);

        if (byUser.isPresent()) {
            BlackList blackList = byUser.get();
            blackList.setUserReportedCount(blackList.getUserReportedCount() + 1);

        }
    }
}
