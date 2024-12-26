package org.example.backend.api.admin.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.api.notification.service.EmailService;
import org.example.backend.api.notification.service.NotificationService;
import org.example.backend.api.notification.service.PushNotificationService;
import org.example.backend.api.user.model.dto.AdminResponseDto;
import org.example.backend.api.user.model.dto.RequestDetailDto;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.RequestRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
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

        // email 전송
        User user = userRepository.findById(request.getRequestUser().getUserId())
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));
        String subject = "[재료 추가 요청 결과 알림]";
        String message = "";
        StringBuilder content = new StringBuilder();

        if (taskStatus.equals(TaskStatus.ACCEPTED)) {   // 수락
            content.append("<h3>회원님께서 요청하신 재료가 추가되었습니다!</h3><br>" +
                    "요청하신 내용 : " + request.getRequestContent() +
                    "<br><br>지금 바로 냉장고에 등록하고 편리하게 관리해보세요!<br>" +
                    "재료 관리 페이지에서 추가된 재료를 확인하실 수 있습니다.");
            message = String.format(subject + " 회원님께서 요청하신 재료가 추가되었습니다!");
        } else if (taskStatus.equals(TaskStatus.DENIED)) {      // 거절
            content.append("<h3>회원님께서 요청하신 <strong>재료 추가 요청</strong>에 대한 처리 결과를 안내드립니다.</h3><br>" +
                    "요청하신 내용 : " + request.getRequestContent() +
                    "<br><br>아쉽게도 요청하신 내용은 다음과 같은 이유로 처리되지 않았습니다 : <br>" + "<strong>" + adminResponseDto.getResponseMessage() +
                    "</strong><br>이와 관련하여 추가적인 문의 사항이 있으시면 언제든지 고객센터로 문의해 주세요.");
            message = String.format(subject + " 회원님께서 요청하신 재료가 추가되지 않았습니다.");
        } else {
            throw new RequestNotFoundException("요청이 없거나 아직 대기상태입니다.");
        }
        emailService.sendEmail(user.getUserEmail(), subject, content.toString());

        // push 알림
        pushNotificationService.sendPushNotification(user.getUserId(), message);

        // db 저장
        notificationService.saveRequestNotification(
                user,
                NotificationType.FOOD_REQUEST_RESULT,
                "재료 추가 요청 결과 : " + taskStatus.getDescription() +"되었습니다!",
                updated.getRequestId()
        );

        return RequestDetailDto.of(updated);
    }
}
