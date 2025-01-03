package org.example.backend.exceptions;

import org.example.backend.api.admin.controller.AdminController;
import org.example.backend.api.foodlist.controller.FoodListController;
import org.example.backend.api.myfridge.controller.MyfridgeController;
import org.example.backend.api.notification.controller.NotificationController;
import org.example.backend.api.notification.controller.PushNotificationController;
import org.example.backend.api.post.controller.PostController;
import org.example.backend.api.recipe.controller.RecipeController;
import org.example.backend.api.trade.controller.TradeController;
import org.example.backend.api.user.controller.UserController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(annotations = { RestController.class}, basePackageClasses = { AdminController.class, FoodListController.class, MyfridgeController.class,
NotificationController.class, PostController.class, PushNotificationController.class, RecipeController.class, TradeController.class, UserController.class })
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        StackTraceElement stackTraceElement = ex.getStackTrace()[0];

        // 발생 위치 정보 구성
        String errorLocation = String.format("Exception in %s.%s (line: %d)",
            stackTraceElement.getClassName(),
            stackTraceElement.getMethodName(),
            stackTraceElement.getLineNumber());

        // 상세 에러 메시지 작성
        String errorMessage = String.format("Error occurred: %s\nLocation: %s", ex.getMessage(), errorLocation);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }

    @ExceptionHandler(RecipeNotFoundException.class)
    public ResponseEntity<String> handleRecipeNotFoundException(RecipeNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorizedException(UnauthorizedException ex) {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ex.getMessage());
    }

    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<String> handlePostNotFoundException(PostNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(TradeRequestHandleException.class)
    public ResponseEntity<String> handleTradeRequestHandleException(TradeRequestHandleException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(TradeNotFoundException.class)
    public ResponseEntity<String> handleTradeNotFoundException(TradeNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(TradeRoomNotFoundException.class)
    public ResponseEntity<String> handleTradeRoomNotFoundException(TradeRoomNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(TradeNotCompletedException.class)
    public ResponseEntity<String> handleTradeNotCompletedException(TradeNotCompletedException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(KindnessAlreadyReviewedException.class)
    public ResponseEntity<String> handleKindnessAlreadyReviewedException(KindnessAlreadyReviewedException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(PostCannotBeDeletedException.class)
    public ResponseEntity<String> handlePostCannotBeDeletedException(PostCannotBeDeletedException ex) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ex.getMessage());
    }

    @ExceptionHandler(S3FileNotDeletedException.class)
    public ResponseEntity<String> handleS3FileNotDeletedException(S3FileNotDeletedException ex) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ex.getMessage());
    }

    @ExceptionHandler(TaskStatusNotPendingException.class)
    public ResponseEntity<String> handleTaskStatusNotPendingException(TaskStatusNotPendingException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ex.getMessage());
    }
}
