package com.example.fsm.service.Impl;

import com.example.fsm.dto.companydto.CompanyResponseDto;
import com.example.fsm.dto.companydto.CreateCompanyDto;
import com.example.fsm.entity.CompanyEntity;
import com.example.fsm.repository.CompanyRepository;
import com.example.fsm.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public CompanyResponseDto createCompany(CreateCompanyDto request) {

        CompanyEntity company = new CompanyEntity();

        company.setLegalName(request.getLegalName());
        company.setBrandName(request.getBrandName());
        company.setPhone(request.getPhone());
        company.setEmail(request.getEmail());
        company.setOfficeAddress(request.getOfficeAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setPincode(request.getPincode());
        company.setCountry(request.getCountry());

        // GST
        company.setIsGstRegistered(request.getIsGstRegistered());
        company.setGstIdentificationNumber(
                request.getGstIdentificationNumber()
        );
        company.setGstName(request.getGstName());
        company.setRegisteredGstAddress(
                request.getRegisteredGstAddress()
        );
        company.setRegisteredState(request.getRegisteredState());
        company.setRegisteredPin(request.getRegisteredPin());

        company.setTaxEnabled(request.getTaxEnabled());
        company.setTaxPercentage(request.getTaxPercentage());

        CompanyEntity savedCompany = companyRepository.save(company);

        String logoPath = saveLogo(
                request.getLogo(),
                savedCompany
        );

        if (logoPath != null) {
            savedCompany.setLogo(logoPath);
            savedCompany = companyRepository.save(savedCompany);
        }

        return mapToResponse(savedCompany);
    }

    @Override
    public CompanyResponseDto getCompanyById(Long id) {

        CompanyEntity company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (Boolean.TRUE.equals(company.getDeleted())) {
            throw new RuntimeException("Company not found");
        }

        return mapToResponse(company);
    }

    @Override
    public List<CompanyResponseDto> getAllCompanies() {

        return companyRepository.findAll()
                .stream()
                .filter(company -> !Boolean.TRUE.equals(company.getDeleted()))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CompanyResponseDto updateCompany(
            Long id,
            CreateCompanyDto request
    ) {

        CompanyEntity company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (Boolean.TRUE.equals(company.getDeleted())) {
            throw new RuntimeException("Company not found");
        }

        company.setLegalName(request.getLegalName());
        company.setBrandName(request.getBrandName());
        company.setPhone(request.getPhone());
        company.setEmail(request.getEmail());
        company.setOfficeAddress(request.getOfficeAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setPincode(request.getPincode());
        company.setCountry(request.getCountry());
        company.setIsGstRegistered(request.getIsGstRegistered());
        company.setGstIdentificationNumber(
                request.getGstIdentificationNumber()
        );
        company.setGstName(request.getGstName());
        company.setRegisteredGstAddress(
                request.getRegisteredGstAddress()
        );
        company.setRegisteredState(request.getRegisteredState());
        company.setRegisteredPin(request.getRegisteredPin());

        company.setTaxEnabled(request.getTaxEnabled());
        company.setTaxPercentage(request.getTaxPercentage());

        if (request.getLogo() != null && !request.getLogo().isEmpty()) {

            String logoPath = saveLogo(
                    request.getLogo(),
                    company
            );

            company.setLogo(logoPath);
        }

        CompanyEntity updatedCompany =
                companyRepository.save(company);

        return mapToResponse(updatedCompany);
    }

    @Override
    public void deleteCompany(Long id) {

        CompanyEntity company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (Boolean.TRUE.equals(company.getDeleted())) {
            throw new RuntimeException("Company already deleted");
        }

        company.setDeleted(true);
        company.setDeletedAt(LocalDateTime.now());

        companyRepository.save(company);
    }

    private String saveLogo(
            MultipartFile file,
            CompanyEntity company
    ) {

        if (file == null || file.isEmpty()) {
            return company.getLogo();
        }

        try {

            String brandName = company.getBrandName()
                    .toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("^-|-$", "");

            Path directory = Paths.get(
                    uploadDir,
                    "logo",
                    brandName
            );

            Files.createDirectories(directory);

            String originalFileName =
                    file.getOriginalFilename();

            String extension = ".jpg";

            if (originalFileName != null
                    && originalFileName.contains(".")) {

                extension = originalFileName
                        .substring(
                                originalFileName.lastIndexOf(".")
                        )
                        .toLowerCase();
            }

            String fileName =
                    company.getId() + extension;

            Path filePath =
                    directory.resolve(fileName);

            file.transferTo(filePath.toFile());

            return "upload/logo/"
                    + brandName
                    + "/"
                    + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save company logo",
                    e
            );
        }
    }

    private CompanyResponseDto mapToResponse(
            CompanyEntity company
    ) {

        CompanyResponseDto response =
                new CompanyResponseDto();

        response.setId(company.getId());
        response.setLegalName(company.getLegalName());
        response.setBrandName(company.getBrandName());
        response.setLogo(company.getLogo());
        response.setPhone(company.getPhone());
        response.setEmail(company.getEmail());
        response.setOfficeAddress(company.getOfficeAddress());
        response.setCity(company.getCity());
        response.setState(company.getState());
        response.setPincode(company.getPincode());
        response.setCountry(company.getCountry());

        response.setIsGstRegistered(
                company.getIsGstRegistered()
        );
        response.setGstIdentificationNumber(
                company.getGstIdentificationNumber()
        );
        response.setGstName(company.getGstName());
        response.setRegisteredGstAddress(
                company.getRegisteredGstAddress()
        );
        response.setRegisteredState(
                company.getRegisteredState()
        );
        response.setRegisteredPin(
                company.getRegisteredPin()
        );
        response.setTaxEnabled(
                company.getTaxEnabled()
        );
        response.setTaxPercentage(
                company.getTaxPercentage()
        );


        response.setCreatedAt(company.getCreatedAt());
        response.setCreatedBy(company.getCreatedBy());
        response.setUpdatedAt(company.getUpdatedAt());
        response.setUpdatedBy(company.getUpdatedBy());
        response.setDeleted(company.getDeleted());
        response.setDeletedAt(company.getDeletedAt());
        response.setDeletedBy(company.getDeletedBy());

        return response;
    }
}