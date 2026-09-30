package com.example.fsm.service;

import com.example.fsm.dto.jobdto.CreateJobDto;
import com.example.fsm.dto.jobdto.DeleteJobDto;
import com.example.fsm.dto.jobdto.JobIdRequestDto;
import com.example.fsm.dto.jobdto.JobResponseDto;
import com.example.fsm.dto.jobdto.UpdateJobDto;

import java.util.List;

public interface JobService {

    JobResponseDto createJob(CreateJobDto request);

    JobResponseDto getJobById(JobIdRequestDto request);

    List<JobResponseDto> getAllJobs();

    List<JobResponseDto> getJobsByUserId(Long userId);

    JobResponseDto updateJob(UpdateJobDto request);

    void deleteJob(DeleteJobDto request);

    List<JobResponseDto> getUnassignedJobs();

}