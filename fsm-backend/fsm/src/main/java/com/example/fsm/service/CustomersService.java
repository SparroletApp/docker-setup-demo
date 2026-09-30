package com.example.fsm.service;


import com.example.fsm.dto.customerdto.CreateCustomerDto;
import com.example.fsm.dto.customerdto.CustomerResponseDto;

import java.util.List;

public interface CustomersService {

    CustomerResponseDto createCustomer(CreateCustomerDto request);

    CustomerResponseDto getCustomerById(Long id);

    List<CustomerResponseDto> getAllCustomers();

    CustomerResponseDto updateCustomer(Long id, CreateCustomerDto request);

    void deleteCustomer(Long id);
}