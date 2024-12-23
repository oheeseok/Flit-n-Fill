package org.example.backend.api.admin.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.api.user.model.dto.AdminResponseDto;
import org.example.backend.api.user.model.dto.RequestDetailDto;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.repository.RequestRepository;
import org.example.backend.enums.TaskStatus;
import org.example.backend.exceptions.RequestNotFoundException;
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

        // 알림 로직

        return RequestDetailDto.of(updated);
    }
}
