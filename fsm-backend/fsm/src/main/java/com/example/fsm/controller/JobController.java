package com.example.fsm.controller;

import com.example.fsm.dto.jobdto.*;
import com.example.fsm.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping("/create")
    public ResponseEntity<JobResponseDto> createJob(
            @RequestBody CreateJobDto request
    ) {

        JobResponseDto response =
                jobService.createJob(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/list/user")
    public ResponseEntity<List<JobResponseDto>> getJobsByUser(
            @RequestBody UserJobRequestDto request
    ) {

        List<JobResponseDto> response =
                jobService.getJobsByUserId(
                        request.getUserId()
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/list/unassigned")
    public ResponseEntity<List<JobResponseDto>> getUnassignedJobs() {

        List<JobResponseDto> response =
                jobService.getUnassignedJobs();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/get")
    public ResponseEntity<JobResponseDto> getJobById(
            @RequestBody JobIdRequestDto request
    ) {

        JobResponseDto response =
                jobService.getJobById(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/list")
    public ResponseEntity<List<JobResponseDto>> getAllJobs() {

        List<JobResponseDto> response =
                jobService.getAllJobs();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<JobResponseDto> updateJob(
            @RequestBody UpdateJobDto request
    ) {

        JobResponseDto response =
                jobService.updateJob(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteJob(
            @RequestBody DeleteJobDto request
    ) {

        jobService.deleteJob(request);

        return ResponseEntity.noContent().build();
    }
}