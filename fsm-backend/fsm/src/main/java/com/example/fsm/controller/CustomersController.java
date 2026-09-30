package com.example.fsm.controller;

import com.example.fsm.dto.customerdto.CreateCustomerDto;
import com.example.fsm.dto.customerdto.CustomerIdDto;
import com.example.fsm.dto.customerdto.CustomerResponseDto;
import com.example.fsm.service.CustomersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomersController {

    private final CustomersService customersService;

    @PostMapping("/create")
    public ResponseEntity<CustomerResponseDto> createCustomer(
            @RequestBody CreateCustomerDto request) {

        CustomerResponseDto response =
                customersService.createCustomer(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/get")
    public ResponseEntity<CustomerResponseDto> getCustomerById(
            @RequestBody CustomerIdDto request) {

        CustomerResponseDto response =
                customersService.getCustomerById(request.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/list")
    public ResponseEntity<List<CustomerResponseDto>> getAllCustomers() {

        List<CustomerResponseDto> response =
                customersService.getAllCustomers();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<CustomerResponseDto> updateCustomer(
            @RequestBody CreateCustomerDto request) {

        CustomerResponseDto response =
                customersService.updateCustomer(request.getId(), request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteCustomer(
            @RequestBody CustomerIdDto request) {

        customersService.deleteCustomer(request.getId());

        return ResponseEntity.noContent().build();
    }
}