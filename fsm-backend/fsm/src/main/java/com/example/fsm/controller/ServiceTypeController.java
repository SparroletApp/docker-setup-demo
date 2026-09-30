package com.example.fsm.controller;

import com.example.fsm.dto.servicetypedto.CreateServiceTypeDto;
import com.example.fsm.dto.servicetypedto.ServiceTypeIdDto;
import com.example.fsm.dto.servicetypedto.ServiceTypeResponseDto;
import com.example.fsm.dto.servicetypedto.UpdateServiceTypeDto;
import com.example.fsm.service.ServiceTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service-type")
@RequiredArgsConstructor
public class ServiceTypeController {

    private final ServiceTypeService serviceTypeService;

    @PostMapping("/create")
    public ResponseEntity<ServiceTypeResponseDto> createServiceType(
            @RequestBody CreateServiceTypeDto dto) {

        ServiceTypeResponseDto response =
                serviceTypeService.createServiceType(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/get-all")
    public ResponseEntity<List<ServiceTypeResponseDto>> getAllServiceTypes() {

        List<ServiceTypeResponseDto> response =
                serviceTypeService.getAllServiceTypes();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/get-by-id")
    public ResponseEntity<ServiceTypeResponseDto> getServiceTypeById(
            @RequestBody ServiceTypeIdDto dto) {

        ServiceTypeResponseDto response =
                serviceTypeService.getServiceTypeById(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<ServiceTypeResponseDto> updateServiceType(
            @RequestBody UpdateServiceTypeDto dto) {

        ServiceTypeResponseDto response =
                serviceTypeService.updateServiceType(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteServiceType(
            @RequestBody ServiceTypeIdDto dto) {

        serviceTypeService.deleteServiceType(dto);

        return ResponseEntity.noContent().build();
    }
}