package com.example.fsm.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(
            IllegalArgumentException ex) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex) {

        String message = ex.getMessage();

        if (message != null) {

            String lowerMessage = message.toLowerCase();

            if (lowerMessage.contains("not found")) {
                return buildResponse(
                        HttpStatus.NOT_FOUND,
                        message
                );
            }

            if (lowerMessage.contains("already registered")
                    || lowerMessage.contains("already exists")
                    || lowerMessage.contains("duplicate")) {

                return buildResponse(
                        HttpStatus.CONFLICT,
                        message
                );
            }
        }

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                message != null ? message : "Bad request"
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(
            Exception ex) {

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error"
        );
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status,
            String message) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("status", status.value());
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(status)
                .body(response);
    }
}