package com.example.fsm.service;

import com.example.fsm.dto.companydto.CompanyResponseDto;
import com.example.fsm.dto.companydto.CreateCompanyDto;

import java.util.List;

public interface CompanyService {

    CompanyResponseDto createCompany(CreateCompanyDto request);

    CompanyResponseDto getCompanyById(Long id);

    List<CompanyResponseDto> getAllCompanies();

    CompanyResponseDto updateCompany(Long id, CreateCompanyDto request);

    void deleteCompany(Long id);
}