
package com.example.fsm.service.Impl;

import com.example.fsm.dto.customerdto.CreateCustomerDto;
import com.example.fsm.dto.customerdto.CustomerResponseDto;
import com.example.fsm.entity.CompanyEntity;
import com.example.fsm.entity.CustomersEntity;
import com.example.fsm.repository.CompanyRepository;
import com.example.fsm.repository.CustomersRepository;
import com.example.fsm.service.CustomersService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomersServiceImpl implements CustomersService {

    private final CustomersRepository customersRepository;
    private final CompanyRepository companyRepository;

    @Override
    public CustomerResponseDto createCustomer(CreateCustomerDto request) {

        CompanyEntity company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (Boolean.TRUE.equals(company.getDeleted())) {
            throw new RuntimeException("Company not found");
        }

        CustomersEntity customer = new CustomersEntity();

        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setPincode(request.getPincode());
        customer.setCompany(company);

        customer.setCreatedBy(request.getCreatedBy());
        customer.setCreatedAt(LocalDateTime.now());

        // First save to generate the database ID
        CustomersEntity savedCustomer = customersRepository.save(customer);

        // Generate customer ID using the generated database ID
        String customerId = String.format(
                "CUS-%03d",
                savedCustomer.getId()
        );

        savedCustomer.setCustomerId(customerId);

        // Save again with generated customer ID
        savedCustomer = customersRepository.save(savedCustomer);

        return mapToResponse(savedCustomer);
    }

    @Override
    public CustomerResponseDto getCustomerById(Long id) {

        CustomersEntity customer = customersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (Boolean.TRUE.equals(customer.getDeleted())) {
            throw new RuntimeException("Customer not found");
        }

        return mapToResponse(customer);
    }

    @Override
    public List<CustomerResponseDto> getAllCustomers() {

        return customersRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CustomerResponseDto updateCustomer(
            Long id,
            CreateCustomerDto request) {

        CustomersEntity customer = customersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (Boolean.TRUE.equals(customer.getDeleted())) {
            throw new RuntimeException("Customer not found");
        }

        CompanyEntity company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (Boolean.TRUE.equals(company.getDeleted())) {
            throw new RuntimeException("Company not found");
        }

        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setPincode(request.getPincode());
        customer.setCompany(company);

        customer.setUpdatedBy(request.getCreatedBy());
        customer.setUpdatedAt(LocalDateTime.now());

        CustomersEntity updatedCustomer =
                customersRepository.save(customer);

        return mapToResponse(updatedCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {

        CustomersEntity customer = customersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (Boolean.TRUE.equals(customer.getDeleted())) {
            throw new RuntimeException("Customer already deleted");
        }

        customer.setDeleted(true);
        customer.setDeletedAt(LocalDateTime.now());

        customersRepository.save(customer);
    }

    private CustomerResponseDto mapToResponse(CustomersEntity customer) {

        CustomerResponseDto response = new CustomerResponseDto();

        response.setId(customer.getId());
        response.setCustomerId(customer.getCustomerId());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setAddress(customer.getAddress());
        response.setPincode(customer.getPincode());

        response.setCreatedBy(customer.getCreatedBy());
        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedBy(customer.getUpdatedBy());
        response.setUpdatedAt(customer.getUpdatedAt());

        if (customer.getCompany() != null) {
            response.setCompanyId(customer.getCompany().getId());
        }

        return response;
    }
}

