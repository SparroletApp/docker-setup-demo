package com.example.fsm.controller;

import com.example.fsm.dto.companydto.CompanyIdDto;
import com.example.fsm.dto.companydto.CompanyResponseDto;
import com.example.fsm.dto.companydto.CreateCompanyDto;
import com.example.fsm.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<CompanyResponseDto> createCompany(
            @ModelAttribute CreateCompanyDto request) {

        CompanyResponseDto response =
                companyService.createCompany(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/get")
    public ResponseEntity<CompanyResponseDto> getCompanyById(
            @RequestBody CompanyIdDto request) {

        CompanyResponseDto response =
                companyService.getCompanyById(request.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/list")
    public ResponseEntity<List<CompanyResponseDto>> getAllCompanies() {

        List<CompanyResponseDto> response =
                companyService.getAllCompanies();

        return ResponseEntity.ok(response);
    }

    @PostMapping(
            value = "/update",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )

    public CompanyResponseDto updateCompany(
            @ModelAttribute CreateCompanyDto request) {

        System.out.println(
                "Company update request ID: " + request.getId()
        );

        return companyService.updateCompany(
                request.getId(),
                request
        );
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteCompany(
            @RequestBody CompanyIdDto request) {

        companyService.deleteCompany(request.getId());

        return ResponseEntity.noContent().build();
    }
}