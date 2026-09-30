package com.example.fsm.service;

import com.example.fsm.dto.userdto.*;

import java.util.List;

public interface UserService {

    UserResponseDto createUser(CreateUserDto request);

    UserResponseDto login(PhoneRequestDto request);

    LoginResponseDto verifyOtp(OtpRequestDto request);
    UserResponseDto getUserById(UserIdRequestDto request);

    List<UserResponseDto> getAllUsers();

    UserResponseDto updateUser(UpdateUserDto request);

    void deleteUser(DeleteUserDto request);
}