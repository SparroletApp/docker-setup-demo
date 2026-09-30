package com.example.fsm.service;

import com.example.fsm.dto.partdto.CreatePartDto;
import com.example.fsm.dto.partdto.DeletePartDto;
import com.example.fsm.dto.partdto.PartResponseDto;
import com.example.fsm.dto.partdto.UpdatePartDto;

import java.util.List;

public interface PartService {

    PartResponseDto createPart(CreatePartDto dto);

    List<PartResponseDto> getAllParts();

    PartResponseDto getPartById(Long id);

    PartResponseDto updatePart(UpdatePartDto dto);

    void deletePart(DeletePartDto dto);
}