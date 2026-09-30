package com.example.fsm.controller;

import com.example.fsm.dto.userdto.*;
import com.example.fsm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<UserResponseDto> createUser(
            @RequestBody CreateUserDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> login(
            @RequestBody PhoneRequestDto request) {

        return ResponseEntity.ok(
                userService.login(request)
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponseDto> verifyOtp(
            @RequestBody OtpRequestDto request) {

        return ResponseEntity.ok(
                userService.verifyOtp(request)
        );
    }

    @PostMapping("/get")
    public ResponseEntity<UserResponseDto> getUser(
            @RequestBody UserIdRequestDto request) {

        return ResponseEntity.ok(
                userService.getUserById(request)
        );
    }

    @PostMapping("/list")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/update")
    public ResponseEntity<UserResponseDto> updateUser(
            @RequestBody UpdateUserDto request) {

        return ResponseEntity.ok(
                userService.updateUser(request)
        );
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteUser(
            @RequestBody DeleteUserDto request) {

        userService.deleteUser(request);

        return ResponseEntity.noContent().build();
    }

    @lombok.Data
    public static class UpdateUserRequest {

        private String phone;
        private String role;
    }
}