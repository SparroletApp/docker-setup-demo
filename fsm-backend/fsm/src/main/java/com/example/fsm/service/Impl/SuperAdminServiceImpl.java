package com.example.fsm.service.Impl;

import com.example.fsm.config.JwtService;
import com.example.fsm.dto.superadmindto.*;
import com.example.fsm.entity.SuperAdminEntity;
import com.example.fsm.repository.SuperAdminRepository;
import com.example.fsm.service.SuperAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SuperAdminServiceImpl implements SuperAdminService {

    private final SuperAdminRepository superAdminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public SuperAdminResponseDto createSuperAdmin(SuperAdminRequestDto request) {

        if (request == null) {
            throw new RuntimeException("Request is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (superAdminRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        SuperAdminEntity superAdmin = new SuperAdminEntity();

        superAdmin.setEmail(email);
        superAdmin.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        superAdmin.setRole("SUPER_ADMIN");

        SuperAdminEntity savedSuperAdmin =
                superAdminRepository.save(superAdmin);

        return mapToResponse(savedSuperAdmin);
    }

    @Override
    public SuperAdminResponseDto updateSuperAdmin(
            SuperAdminUpdateRequestDto request) {

        if (request == null) {
            throw new RuntimeException("Request is required");
        }

        if (request.getId() == null) {
            throw new RuntimeException("Super admin ID is required");
        }

        SuperAdminEntity superAdmin =
                superAdminRepository.findById(request.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Super admin not found")
                        );

        if (request.getEmail() != null &&
                !request.getEmail().isBlank()) {

            String email = request.getEmail()
                    .trim()
                    .toLowerCase();

            if (!email.equals(superAdmin.getEmail())
                    && superAdminRepository.existsByEmail(email)) {

                throw new RuntimeException("Email already registered");
            }

            superAdmin.setEmail(email);
        }

        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            superAdmin.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );
        }

        superAdmin.setRole("SUPER_ADMIN");

        SuperAdminEntity updatedSuperAdmin =
                superAdminRepository.save(superAdmin);

        return mapToResponse(updatedSuperAdmin);
    }

    @Override
    public SuperAdminResponseDto login(
            SuperAdminLoginRequestDto request) {

        if (request == null) {
            throw new RuntimeException("Request is required");
        }

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new RuntimeException("Password is required");
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        SuperAdminEntity superAdmin =
                superAdminRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password"
                                )
                        );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        superAdmin.getPassword()
                );

        if (!passwordMatches) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(
                superAdmin.getId(),
                superAdmin.getEmail(),
                superAdmin.getRole()
        );

        SuperAdminResponseDto response =
                mapToResponse(superAdmin);

        response.setToken(token);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SuperAdminResponseDto> getAllSuperAdmins() {

        return superAdminRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public void deleteSuperAdmin(SuperAdminIdRequestDto request) {

        if (request == null || request.getId() == null) {
            throw new RuntimeException("Super admin ID is required");
        }

        SuperAdminEntity superAdmin =
                superAdminRepository.findById(request.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Super admin not found")
                        );

        superAdminRepository.delete(superAdmin);
    }

    private SuperAdminResponseDto mapToResponse(
            SuperAdminEntity superAdmin) {

        SuperAdminResponseDto response =
                new SuperAdminResponseDto();

        response.setId(superAdmin.getId());
        response.setEmail(superAdmin.getEmail());
        response.setRole(superAdmin.getRole());
        response.setCreatedAt(superAdmin.getCreatedAt());
        response.setUpdatedAt(superAdmin.getUpdatedAt());

        return response;
    }
}