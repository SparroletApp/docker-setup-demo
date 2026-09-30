package com.example.fsm.service.Impl;

import com.example.fsm.dto.partdto.CreatePartDto;
import com.example.fsm.dto.partdto.DeletePartDto;
import com.example.fsm.dto.partdto.PartResponseDto;
import com.example.fsm.dto.partdto.UpdatePartDto;
import com.example.fsm.entity.CategoryEntity;
import com.example.fsm.entity.PartEntity;
import com.example.fsm.repository.CategoryRepository;
import com.example.fsm.repository.PartRepository;
import com.example.fsm.service.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PartServiceImpl implements PartService {

    private final PartRepository partRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public PartResponseDto createPart(CreatePartDto dto) {

        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        PartEntity part = new PartEntity();

        part.setName(dto.getName());
        part.setSku(dto.getSku());
        part.setCategory(category);
        part.setStockQuantity(dto.getStockQuantity());
        part.setThresholdAlert(dto.getThresholdAlert());
        part.setUnitPrice(dto.getUnitPrice());
        part.setRetailPrice(dto.getRetailPrice());
        part.setSupplier(dto.getSupplier());
        part.setCreatedBy(dto.getCreatedBy());

        PartEntity savedPart = partRepository.save(part);

        return mapToResponse(savedPart);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PartResponseDto> getAllParts() {
        return partRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PartResponseDto getPartById(Long id) {

        PartEntity part = partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Part not found"));

        return mapToResponse(part);
    }

    @Override
    public PartResponseDto updatePart(UpdatePartDto dto) {

        if (dto.getId() == null) {
            throw new RuntimeException("Part ID is required");
        }

        PartEntity part = partRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Part not found"));

        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        part.setName(dto.getName());
        part.setSku(dto.getSku());
        part.setCategory(category);
        part.setStockQuantity(dto.getStockQuantity());
        part.setThresholdAlert(dto.getThresholdAlert());
        part.setUnitPrice(dto.getUnitPrice());
        part.setRetailPrice(dto.getRetailPrice());
        part.setSupplier(dto.getSupplier());
        part.setUpdatedBy(dto.getUpdatedBy());

        PartEntity updatedPart = partRepository.save(part);

        return mapToResponse(updatedPart);
    }

    @Override
    public void deletePart(DeletePartDto dto) {

        PartEntity part = partRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Part not found"));

        part.setDeleted(true);
        part.setDeletedBy(dto.getDeletedBy());

        partRepository.save(part);
    }

    private PartResponseDto mapToResponse(PartEntity part) {

        PartResponseDto response = new PartResponseDto();

        response.setId(part.getId());
        response.setName(part.getName());
        response.setSku(part.getSku());

        if (part.getCategory() != null) {
            response.setCategoryId(part.getCategory().getId());
            response.setCategoryName(part.getCategory().getName());
        }

        response.setStockQuantity(part.getStockQuantity());
        response.setThresholdAlert(part.getThresholdAlert());
        response.setUnitPrice(part.getUnitPrice());
        response.setRetailPrice(part.getRetailPrice());
        response.setSupplier(part.getSupplier());

        response.setCreatedBy(part.getCreatedBy());
        response.setCreatedAt(part.getCreatedAt());
        response.setUpdatedBy(part.getUpdatedBy());
        response.setUpdatedAt(part.getUpdatedAt());

        return response;
    }
}