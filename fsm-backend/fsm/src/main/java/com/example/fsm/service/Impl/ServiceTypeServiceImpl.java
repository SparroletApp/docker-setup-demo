package com.example.fsm.service.Impl;

import com.example.fsm.dto.servicetypedto.CreateServiceTypeDto;
import com.example.fsm.dto.servicetypedto.ServiceTypeIdDto;
import com.example.fsm.dto.servicetypedto.ServiceTypeResponseDto;
import com.example.fsm.dto.servicetypedto.UpdateServiceTypeDto;
import com.example.fsm.entity.ServiceTypeEntity;
import com.example.fsm.repository.ServiceTypeRepository;
import com.example.fsm.service.ServiceTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceTypeServiceImpl implements ServiceTypeService {

    private final ServiceTypeRepository serviceTypeRepository;

    @Override
    public ServiceTypeResponseDto createServiceType(CreateServiceTypeDto dto) {

        ServiceTypeEntity serviceType = new ServiceTypeEntity();

        serviceType.setName(dto.getName());
        serviceType.setDescription(dto.getDescription());
        serviceType.setCreatedBy(dto.getCreatedBy());

        ServiceTypeEntity savedServiceType =
                serviceTypeRepository.save(serviceType);

        return mapToResponse(savedServiceType);
    }

    @Override
    public List<ServiceTypeResponseDto> getAllServiceTypes() {

        return serviceTypeRepository.findAll()
                .stream()
                .filter(serviceType ->
                        !Boolean.TRUE.equals(serviceType.getDeleted()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceTypeResponseDto getServiceTypeById(ServiceTypeIdDto dto) {

        ServiceTypeEntity serviceType =
                serviceTypeRepository.findById(dto.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Service type not found"));

        if (Boolean.TRUE.equals(serviceType.getDeleted())) {
            throw new RuntimeException("Service type not found");
        }

        return mapToResponse(serviceType);
    }

    @Override
    public ServiceTypeResponseDto updateServiceType(UpdateServiceTypeDto dto) {

        ServiceTypeEntity serviceType =
                serviceTypeRepository.findById(dto.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Service type not found"));

        if (Boolean.TRUE.equals(serviceType.getDeleted())) {
            throw new RuntimeException("Service type not found");
        }

        serviceType.setName(dto.getName());
        serviceType.setDescription(dto.getDescription());
        serviceType.setUpdatedBy(dto.getUpdatedBy());
        serviceType.setUpdatedAt(LocalDateTime.now());

        ServiceTypeEntity updatedServiceType =
                serviceTypeRepository.save(serviceType);

        return mapToResponse(updatedServiceType);
    }

    @Override
    public void deleteServiceType(ServiceTypeIdDto dto) {

        ServiceTypeEntity serviceType =
                serviceTypeRepository.findById(dto.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Service type not found"));

        if (Boolean.TRUE.equals(serviceType.getDeleted())) {
            throw new RuntimeException("Service type already deleted");
        }

        serviceType.setDeleted(true);
        serviceType.setDeletedAt(LocalDateTime.now());
        serviceType.setDeletedBy(dto.getDeletedBy());

        serviceTypeRepository.save(serviceType);
    }

    private ServiceTypeResponseDto mapToResponse(
            ServiceTypeEntity serviceType) {

        ServiceTypeResponseDto response =
                new ServiceTypeResponseDto();

        response.setId(serviceType.getId());
        response.setName(serviceType.getName());
        response.setDescription(serviceType.getDescription());

        response.setCreatedAt(serviceType.getCreatedAt());
        response.setCreatedBy(serviceType.getCreatedBy());

        response.setUpdatedAt(serviceType.getUpdatedAt());
        response.setUpdatedBy(serviceType.getUpdatedBy());

        response.setDeleted(serviceType.getDeleted());
        response.setDeletedAt(serviceType.getDeletedAt());
        response.setDeletedBy(serviceType.getDeletedBy());

        return response;
    }
}