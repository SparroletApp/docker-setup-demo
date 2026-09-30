package com.example.fsm.service.Impl;

import com.example.fsm.dto.jobdto.CreateJobDto;
import com.example.fsm.dto.jobdto.DeleteJobDto;
import com.example.fsm.dto.jobdto.JobIdRequestDto;
import com.example.fsm.dto.jobdto.JobResponseDto;
import com.example.fsm.dto.jobdto.UpdateJobDto;
import com.example.fsm.entity.CategoryEntity;
import com.example.fsm.entity.JobEntity;
import com.example.fsm.entity.PartEntity;
import com.example.fsm.entity.TicketEntity;
import com.example.fsm.entity.UserEntity;
import com.example.fsm.repository.CategoryRepository;
import com.example.fsm.repository.JobRepository;
import com.example.fsm.repository.PartRepository;
import com.example.fsm.repository.TicketRepository;
import com.example.fsm.repository.UserRepository;
import com.example.fsm.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final CategoryRepository categoryRepository;
    private final PartRepository partRepository;

    @Override
    public JobResponseDto createJob(CreateJobDto request) {

        if (request == null) {
            throw new RuntimeException("Request is required");
        }

        if (request.getTicketId() == null) {
            throw new RuntimeException("Ticket ID is required");
        }

        if (request.getJobTitle() == null ||
                request.getJobTitle().isBlank()) {

            throw new RuntimeException("Job title is required");
        }

        if (request.getPriority() == null ||
                request.getPriority().isBlank()) {

            throw new RuntimeException("Priority is required");
        }

        if (request.getCreatedBy() == null ||
                request.getCreatedBy().isBlank()) {

            throw new RuntimeException("Created by is required");
        }

        TicketEntity ticket =
                ticketRepository
                        .findById(request.getTicketId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"
                                )
                        );

        UserEntity user = null;

        if (request.getUserId() != null) {

            user =
                    userRepository
                            .findById(request.getUserId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Technician not found"
                                    )
                            );

            if (Boolean.TRUE.equals(user.getDeleted())) {
                throw new RuntimeException(
                        "Technician account has been deleted"
                );
            }

            if (!"TECHNICIAN".equalsIgnoreCase(
                    user.getRole()
            )) {

                throw new RuntimeException(
                        "Selected user is not a technician"
                );
            }
        }

        CategoryEntity category = null;

        if (request.getCategoryId() != null) {

            category =
                    categoryRepository
                            .findById(request.getCategoryId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Category not found"
                                    )
                            );

            if (Boolean.TRUE.equals(category.getDeleted())) {
                throw new RuntimeException(
                        "Category has been deleted"
                );
            }
        }

        PartEntity part = null;

        if (request.getPartId() != null) {

            part =
                    partRepository
                            .findById(request.getPartId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Part not found"
                                    )
                            );

            if (Boolean.TRUE.equals(part.getDeleted())) {
                throw new RuntimeException(
                        "Part has been deleted"
                );
            }
        }

        JobEntity job = new JobEntity();

        job.setUser(user);
        job.setTicket(ticket);
        job.setCategory(category);
        job.setPart(part);

        job.setJobTitle(
                request.getJobTitle().trim()
        );

        job.setPriority(
                request.getPriority()
                        .trim()
                        .toUpperCase()
        );

        job.setExpectedDate(
                request.getExpectedDate()
        );

        job.setStartingDateTime(
                request.getStartingDateTime()
        );

        job.setEndingDateTime(
                request.getEndingDateTime()
        );

        if (request.getEmployeeStatus() != null &&
                !request.getEmployeeStatus().isBlank()) {

            job.setEmployeeStatus(
                    request.getEmployeeStatus()
                            .trim()
                            .toUpperCase()
            );
        }

        if (request.getJobDescription() != null &&
                !request.getJobDescription().isBlank()) {

            job.setJobDescription(
                    request.getJobDescription().trim()
            );
        }

        /*
         * Audit fields
         */
        job.setCreatedBy(
                request.getCreatedBy().trim()
        );

        job.setUpdatedBy(
                request.getUpdatedBy()
        );

        /*
         * Job status
         */
        if (user == null) {
            job.setStatus("UNASSIGNED");
        } else {
            job.setStatus("ASSIGNED");
        }

        /*
         * Save first so the database generates
         * the numeric primary key.
         */
        JobEntity savedJob =
                jobRepository.save(job);

        /*
         * Generate human-readable Job ID.
         */
        String generatedJobId =
                "job-" + savedJob.getId();

        savedJob.setJobId(
                generatedJobId
        );

        /*
         * Save again with the generated job ID.
         */
        savedJob =
                jobRepository.save(savedJob);

        return mapToResponse(savedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponseDto getJobById(
            JobIdRequestDto request) {

        if (request == null) {
            throw new RuntimeException(
                    "Request is required"
            );
        }

        if (request.getId() == null) {
            throw new RuntimeException(
                    "Job ID is required"
            );
        }

        JobEntity job =
                jobRepository
                        .findById(request.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );

        if (Boolean.TRUE.equals(job.getDeleted())) {
            throw new RuntimeException(
                    "Job has been deleted"
            );
        }

        return mapToResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDto> getAllJobs() {

        return jobRepository
                .findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public JobResponseDto updateJob(
            UpdateJobDto request) {

        if (request == null) {
            throw new RuntimeException(
                    "Request is required"
            );
        }

        if (request.getId() == null) {
            throw new RuntimeException(
                    "Job ID is required"
            );
        }

        JobEntity job =
                jobRepository
                        .findById(request.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );

        if (Boolean.TRUE.equals(job.getDeleted())) {
            throw new RuntimeException(
                    "Job has been deleted"
            );
        }

        /*
         * Ticket
         */
        if (request.getTicketId() != null) {

            TicketEntity ticket =
                    ticketRepository
                            .findById(
                                    request.getTicketId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Ticket not found"
                                    )
                            );

            job.setTicket(ticket);
        }

        /*
         * Technician
         */
        if (request.getUserId() != null) {

            UserEntity user =
                    userRepository
                            .findById(
                                    request.getUserId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Technician not found"
                                    )
                            );

            if (Boolean.TRUE.equals(user.getDeleted())) {
                throw new RuntimeException(
                        "Technician account has been deleted"
                );
            }

            if (!"TECHNICIAN".equalsIgnoreCase(
                    user.getRole()
            )) {

                throw new RuntimeException(
                        "Selected user is not a technician"
                );
            }

            job.setUser(user);

            if (request.getStatus() == null ||
                    request.getStatus().isBlank() ||
                    "UNASSIGNED".equalsIgnoreCase(
                            request.getStatus()
                    )) {

                job.setStatus("ASSIGNED");
            }

        } else {

            job.setUser(null);
            job.setStatus("UNASSIGNED");
        }

        /*
         * Category
         */
        if (request.getCategoryId() != null) {

            CategoryEntity category =
                    categoryRepository
                            .findById(
                                    request.getCategoryId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Category not found"
                                    )
                            );

            if (Boolean.TRUE.equals(category.getDeleted())) {
                throw new RuntimeException(
                        "Category has been deleted"
                );
            }

            job.setCategory(category);
        }

        /*
         * Part
         */
        if (request.getPartId() != null) {

            PartEntity part =
                    partRepository
                            .findById(
                                    request.getPartId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Part not found"
                                    )
                            );

            if (Boolean.TRUE.equals(part.getDeleted())) {
                throw new RuntimeException(
                        "Part has been deleted"
                );
            }

            job.setPart(part);
        }

        /*
         * Job title
         */
        if (request.getJobTitle() != null &&
                !request.getJobTitle().isBlank()) {

            job.setJobTitle(
                    request.getJobTitle().trim()
            );
        }

        /*
         * Priority
         */
        if (request.getPriority() != null &&
                !request.getPriority().isBlank()) {

            job.setPriority(
                    request.getPriority()
                            .trim()
                            .toUpperCase()
            );
        }

        /*
         * Expected date
         */
        if (request.getExpectedDate() != null) {

            job.setExpectedDate(
                    request.getExpectedDate()
            );
        }

        /*
         * Starting date and time
         */
        if (request.getStartingDateTime() != null) {

            job.setStartingDateTime(
                    request.getStartingDateTime()
            );
        }

        /*
         * Ending date and time
         */
        if (request.getEndingDateTime() != null) {

            job.setEndingDateTime(
                    request.getEndingDateTime()
            );
        }

        /*
         * Employee status
         */
        if (request.getEmployeeStatus() != null &&
                !request.getEmployeeStatus().isBlank()) {

            job.setEmployeeStatus(
                    request.getEmployeeStatus()
                            .trim()
                            .toUpperCase()
            );
        }

        /*
         * Job description
         */
        if (request.getJobDescription() != null) {

            job.setJobDescription(
                    request.getJobDescription().trim()
            );
        }

        /*
         * Job status
         */
        if (request.getStatus() != null &&
                !request.getStatus().isBlank() &&
                job.getUser() != null) {

            job.setStatus(
                    request.getStatus()
                            .trim()
                            .toUpperCase()
            );
        }

        /*
         * Updated by
         */
        if (request.getUpdatedBy() != null &&
                !request.getUpdatedBy().isBlank()) {

            job.setUpdatedBy(
                    request.getUpdatedBy().trim()
            );
        }

        JobEntity updatedJob =
                jobRepository.save(job);

        return mapToResponse(updatedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDto> getJobsByUserId(
            Long userId) {

        if (userId == null) {
            throw new RuntimeException(
                    "User ID is required"
            );
        }

        UserEntity user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (Boolean.TRUE.equals(user.getDeleted())) {
            throw new RuntimeException(
                    "User account has been deleted"
            );
        }

        return jobRepository
                .findByUser_IdAndDeletedFalse(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDto> getUnassignedJobs() {

        return jobRepository
                .findByUserIsNullAndDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteJob(DeleteJobDto request) {

        if (request == null) {
            throw new RuntimeException(
                    "Request is required"
            );
        }

        if (request.getId() == null) {
            throw new RuntimeException(
                    "Job ID is required"
            );
        }

        if (request.getDeletedBy() == null ||
                request.getDeletedBy().isBlank()) {

            throw new RuntimeException(
                    "Deleted by is required"
            );
        }

        JobEntity job =
                jobRepository
                        .findById(request.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );

        if (Boolean.TRUE.equals(job.getDeleted())) {
            throw new RuntimeException(
                    "Job is already deleted"
            );
        }

        job.setDeleted(true);

        job.setDeletedAt(
                LocalDateTime.now()
        );

        job.setDeletedBy(
                request.getDeletedBy().trim()
        );

        jobRepository.save(job);
    }

    private JobResponseDto mapToResponse(
            JobEntity job) {

        JobResponseDto response =
                new JobResponseDto();

        /*
         * Database ID
         */
        response.setId(
                job.getId()
        );

        /*
         * Human-readable Job ID
         */
        response.setJobId(
                job.getJobId()
        );

        /*
         * Technician
         */
        response.setUserId(
                job.getUser() != null
                        ? job.getUser().getId()
                        : null
        );

        /*
         * Ticket
         */
        response.setTicketId(
                job.getTicket() != null
                        ? job.getTicket().getId()
                        : null
        );

        /*
         * Category
         */
        response.setCategoryId(
                job.getCategory() != null
                        ? job.getCategory().getId()
                        : null
        );

        /*
         * Part
         */
        response.setPartId(
                job.getPart() != null
                        ? job.getPart().getId()
                        : null
        );

        /*
         * Job information
         */
        response.setJobTitle(
                job.getJobTitle()
        );

        response.setPriority(
                job.getPriority()
        );

        response.setExpectedDate(
                job.getExpectedDate()
        );

        response.setStartingDateTime(
                job.getStartingDateTime()
        );

        response.setEndingDateTime(
                job.getEndingDateTime()
        );

        response.setEmployeeStatus(
                job.getEmployeeStatus()
        );

        response.setJobDescription(
                job.getJobDescription()
        );

        response.setStatus(
                job.getStatus()
        );

        response.setCreatedAt(
                job.getCreatedAt()
        );

        response.setCreatedBy(
                job.getCreatedBy()
        );

        response.setUpdatedAt(
                job.getUpdatedAt()
        );

        response.setUpdatedBy(
                job.getUpdatedBy()
        );
        response.setDeleted(
                job.getDeleted()
        );

        response.setDeletedAt(
                job.getDeletedAt()
        );

        response.setDeletedBy(
                job.getDeletedBy()
        );

        return response;
    }
}