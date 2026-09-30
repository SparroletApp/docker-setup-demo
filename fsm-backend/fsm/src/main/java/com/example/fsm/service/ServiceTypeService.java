package com.example.fsm.service;

import com.example.fsm.dto.servicetypedto.CreateServiceTypeDto;
import com.example.fsm.dto.servicetypedto.ServiceTypeIdDto;
import com.example.fsm.dto.servicetypedto.ServiceTypeResponseDto;
import com.example.fsm.dto.servicetypedto.UpdateServiceTypeDto;

import java.util.List;

public interface ServiceTypeService {

    ServiceTypeResponseDto createServiceType(CreateServiceTypeDto dto);

    List<ServiceTypeResponseDto> getAllServiceTypes();

    ServiceTypeResponseDto getServiceTypeById(ServiceTypeIdDto dto);

    ServiceTypeResponseDto updateServiceType(UpdateServiceTypeDto dto);

    void deleteServiceType(ServiceTypeIdDto dto);
}