
package com.example.fsm.service.Impl;

import com.example.fsm.config.JwtService;
import com.example.fsm.dto.userdto.*;
import com.example.fsm.entity.CompanyEntity;
import com.example.fsm.entity.UserEntity;
import com.example.fsm.repository.CompanyRepository;
import com.example.fsm.repository.UserRepository;
import com.example.fsm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CompanyRepository companyRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public UserResponseDto createUser(CreateUserDto request) {

        if (request == null) {
            throw new RuntimeException("Request is required");
        }

        if (request.getName() == null ||
                request.getName().isBlank()) {

            throw new RuntimeException("Name is required");
        }

        if (request.getPhone() == null ||
                request.getPhone().isBlank()) {

            throw new RuntimeException("Phone number is required");
        }

        if (request.getCreatedBy() == null ||
                request.getCreatedBy().isBlank()) {

            throw new RuntimeException("Created by is required");
        }

        String phone =
                normalizePhone(request.getPhone());

        if (userRepository.existsByPhone(phone)) {

            throw new RuntimeException(
                    "Phone number already registered"
            );
        }

        UserEntity user =
                new UserEntity();

        user.setName(
                request.getName().trim()
        );

        user.setPhone(phone);

        /*
         * Email is optional
         */
        if (request.getEmail() != null &&
                !request.getEmail().isBlank()) {

            user.setEmail(
                    request.getEmail().trim()
            );
        }

        /*
         * Specialization is optional
         */
        if (request.getSpecialization() != null &&
                !request.getSpecialization().isBlank()) {

            user.setSpecialization(
                    request.getSpecialization().trim()
            );
        }

        /*
         * Ability is optional
         */
        if (request.getAbility() != null &&
                !request.getAbility().isBlank()) {

            user.setAbility(
                    request.getAbility().trim()
            );
        }

        /*
         * License is optional
         */
        if (request.getLicense() != null) {

            user.setLicense(
                    request.getLicense()
            );
        }

        /*
         * UPI ID is optional
         */
        if (request.getUpiId() != null &&
                !request.getUpiId().isBlank()) {

            user.setUpiId(
                    request.getUpiId().trim()
            );
        }

        user.setCreatedBy(
                request.getCreatedBy().trim()
        );

        /*
         * Set role
         */
        if (userRepository.count() == 0) {

            user.setRole("ADMIN");

        } else {

            if (request.getRole() == null ||
                    request.getRole().isBlank()) {

                throw new RuntimeException(
                        "Role is required"
                );
            }

            user.setRole(
                    request.getRole()
                            .trim()
                            .toUpperCase()
            );
        }

        /*
         * ============================================================
         * COMPANY
         * ============================================================
         */
        if (request.getCompanyId() != null) {

            CompanyEntity company =
                    companyRepository
                            .findById(
                                    request.getCompanyId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Company not found"
                                    )
                            );

            user.setCompany(company);
        }

        /*
         * Generate technician ID only
         * when role is TECHNICIAN.
         */
        if ("TECHNICIAN".equals(user.getRole())) {

            user.setTechnicianId(
                    generateTechnicianId()
            );
        }

        user.setStatus("ACTIVE");

        user.setOtp(null);
        user.setOtpExpiresAt(null);

        UserEntity savedUser =
                userRepository.save(user);

        return mapToResponse(savedUser);
    }

    @Override
    public UserResponseDto login(
            PhoneRequestDto request) {

        if (request == null ||
                request.getPhone() == null ||
                request.getPhone().isBlank()) {

            throw new RuntimeException(
                    "Phone number is required"
            );
        }

        String phone =
                normalizePhone(
                        request.getPhone()
                );

        UserEntity user =
                userRepository
                        .findByPhone(phone)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Phone number not registered"
                                )
                        );

        if (Boolean.TRUE.equals(
                user.getDeleted())) {

            throw new RuntimeException(
                    "User account has been deleted"
            );
        }

        String otp = "123456";

        LocalDateTime expiry =
                LocalDateTime.now()
                        .plusMinutes(5);

        user.setOtp(otp);
        user.setOtpExpiresAt(expiry);

        userRepository.save(user);

        return mapToResponse(user);
    }

    @Override
    public LoginResponseDto verifyOtp(
            OtpRequestDto request) {

        if (request == null) {

            throw new RuntimeException(
                    "Request is required"
            );
        }

        if (request.getPhone() == null ||
                request.getPhone().isBlank()) {

            throw new RuntimeException(
                    "Phone number is required"
            );
        }

        if (request.getOtp() == null ||
                request.getOtp().isBlank()) {

            throw new RuntimeException(
                    "OTP is required"
            );
        }

        String phone =
                normalizePhone(
                        request.getPhone()
                );

        UserEntity user =
                userRepository
                        .findByPhone(phone)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Phone number not registered"
                                )
                        );

        if (Boolean.TRUE.equals(
                user.getDeleted())) {

            throw new RuntimeException(
                    "User account has been deleted"
            );
        }

        if (user.getOtp() == null ||
                user.getOtpExpiresAt() == null) {

            throw new RuntimeException(
                    "OTP not found. Please request a new OTP"
            );
        }

        if (LocalDateTime.now()
                .isAfter(user.getOtpExpiresAt())) {

            user.setOtp(null);
            user.setOtpExpiresAt(null);

            userRepository.save(user);

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP"
            );
        }

        if (!user.getOtp()
                .equals(request.getOtp().trim())) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        user.setStatus("ACTIVE");

        user.setOtp(null);
        user.setOtpExpiresAt(null);

        UserEntity updatedUser =
                userRepository.save(user);

        String token =
                jwtService.generateToken(
                        updatedUser.getId(),
                        updatedUser.getPhone(),
                        updatedUser.getRole()
                );

        LoginResponseDto response =
                new LoginResponseDto();

        response.setToken(token);

        response.setUser(
                mapToResponse(updatedUser)
        );

        return response;
    }

    @Override
    public UserResponseDto getUserById(
            UserIdRequestDto request) {

        if (request == null) {

            throw new RuntimeException(
                    "Request is required"
            );
        }

        if (request.getId() == null) {

            throw new RuntimeException(
                    "User ID is required"
            );
        }

        UserEntity user =
                userRepository
                        .findById(request.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (Boolean.TRUE.equals(
                user.getDeleted())) {

            throw new RuntimeException(
                    "User account has been deleted"
            );
        }

        return mapToResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .filter(user ->
                        !Boolean.TRUE.equals(
                                user.getDeleted()
                        )
                )
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public UserResponseDto updateUser(
            UpdateUserDto request) {

        if (request == null) {

            throw new RuntimeException(
                    "Request is required"
            );
        }

        if (request.getId() == null) {

            throw new RuntimeException(
                    "User ID is required"
            );
        }

        if (request.getName() == null ||
                request.getName().isBlank()) {

            throw new RuntimeException(
                    "Name is required"
            );
        }

        if (request.getPhone() == null ||
                request.getPhone().isBlank()) {

            throw new RuntimeException(
                    "Phone number is required"
            );
        }

        String normalizedPhone =
                normalizePhone(
                        request.getPhone()
                );

        UserEntity user =
                userRepository
                        .findById(request.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (Boolean.TRUE.equals(
                user.getDeleted())) {

            throw new RuntimeException(
                    "User account has been deleted"
            );
        }

        if (!normalizedPhone.equals(user.getPhone())
                && userRepository.existsByPhone(
                normalizedPhone
        )) {

            throw new RuntimeException(
                    "Phone number already registered"
            );
        }

        user.setName(
                request.getName().trim()
        );

        user.setPhone(
                normalizedPhone
        );

        /*
         * Email
         */
        if (request.getEmail() != null &&
                !request.getEmail().isBlank()) {

            user.setEmail(
                    request.getEmail().trim()
            );

        } else {

            user.setEmail(null);
        }

        /*
         * Specialization
         */
        if (request.getSpecialization() != null &&
                !request.getSpecialization().isBlank()) {

            user.setSpecialization(
                    request.getSpecialization().trim()
            );

        } else {

            user.setSpecialization(null);
        }

        /*
         * Ability
         */
        if (request.getAbility() != null &&
                !request.getAbility().isBlank()) {

            user.setAbility(
                    request.getAbility().trim()
            );

        } else {

            user.setAbility(null);
        }

        /*
         * License
         */
        user.setLicense(
                request.getLicense()
        );

        /*
         * UPI ID
         */
        if (request.getUpiId() != null &&
                !request.getUpiId().isBlank()) {

            user.setUpiId(
                    request.getUpiId().trim()
            );

        } else {

            user.setUpiId(null);
        }

        /*
         * Role
         */
        if (request.getRole() != null &&
                !request.getRole().isBlank()) {

            String newRole =
                    request.getRole()
                            .trim()
                            .toUpperCase();

            /*
             * If changing user to TECHNICIAN
             * and technician ID does not exist,
             * generate one.
             */
            if ("TECHNICIAN".equals(newRole) &&
                    !"TECHNICIAN".equals(user.getRole()) &&
                    user.getTechnicianId() == null) {

                user.setTechnicianId(
                        generateTechnicianId()
                );
            }

            user.setRole(newRole);
        }

        /*
         * Status
         */
        if (request.getStatus() != null &&
                !request.getStatus().isBlank()) {

            user.setStatus(
                    request.getStatus()
                            .trim()
                            .toUpperCase()
            );
        }

        user.setUpdatedBy(
                request.getUpdatedBy()
        );

        /*
         * Company
         */
        if (request.getCompanyId() != null) {

            CompanyEntity company =
                    companyRepository
                            .findById(
                                    request.getCompanyId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Company not found"
                                    )
                            );

            user.setCompany(company);
        }

        UserEntity updatedUser =
                userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(
            DeleteUserDto request) {

        if (request == null) {

            throw new RuntimeException(
                    "Request is required"
            );
        }

        if (request.getId() == null) {

            throw new RuntimeException(
                    "User ID is required"
            );
        }

        if (request.getDeletedBy() == null ||
                request.getDeletedBy().isBlank()) {

            throw new RuntimeException(
                    "Deleted by is required"
            );
        }

        UserEntity user =
                userRepository
                        .findById(request.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (Boolean.TRUE.equals(
                user.getDeleted())) {

            throw new RuntimeException(
                    "User is already deleted"
            );
        }

        user.setDeleted(true);

        user.setDeletedAt(
                LocalDateTime.now()
        );

        user.setDeletedBy(
                request.getDeletedBy().trim()
        );

        user.setOtp(null);
        user.setOtpExpiresAt(null);

        userRepository.save(user);
    }

    /*
     * ============================================================
     * GENERATE OTP
     * ============================================================
     */
    private String generateOtp() {

        int otp =
                100000 +
                        secureRandom.nextInt(900000);

        return String.valueOf(otp);
    }

    /*
     * ============================================================
     * GENERATE TECHNICIAN ID
     * ============================================================
     */
    private String generateTechnicianId() {

        String technicianId;

        do {

            int number =
                    100 +
                            secureRandom.nextInt(900);

            technicianId =
                    "TECH-" + number;

        } while (
                userRepository.existsByTechnicianId(
                        technicianId
                )
        );

        return technicianId;
    }

    /*
     * ============================================================
     * MAP ENTITY TO RESPONSE
     * ============================================================
     */
    private UserResponseDto mapToResponse(
            UserEntity user) {

        UserResponseDto response =
                new UserResponseDto();

        response.setId(
                user.getId()
        );

        response.setName(
                user.getName()
        );

        response.setPhone(
                user.getPhone()
        );

        response.setEmail(
                user.getEmail()
        );

        response.setRole(
                user.getRole()
        );

        response.setTechnicianId(
                user.getTechnicianId()
        );

        response.setStatus(
                user.getStatus()
        );

        response.setSpecialization(
                user.getSpecialization()
        );

        response.setAbility(
                user.getAbility()
        );

        response.setLicense(
                user.getLicense()
        );

        response.setUpiId(
                user.getUpiId()
        );

        response.setCompanyId(
                user.getCompany() != null
                        ? user.getCompany().getId()
                        : null
        );

        response.setCreatedAt(
                user.getCreatedAt()
        );

        response.setCreatedBy(
                user.getCreatedBy()
        );

        response.setUpdatedAt(
                user.getUpdatedAt()
        );

        response.setUpdatedBy(
                user.getUpdatedBy()
        );

        response.setDeleted(
                user.getDeleted()
        );

        response.setDeletedAt(
                user.getDeletedAt()
        );

        response.setDeletedBy(
                user.getDeletedBy()
        );

        return response;
    }

    private String normalizePhone(String phone) {

        String value = phone.trim()
                .replace(" ", "")
                .replace("-", "")
                .replace("(", "")
                .replace(")", "");

        return value;
    }
}