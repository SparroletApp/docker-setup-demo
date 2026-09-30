package com.example.fsm.service.Impl;

import com.example.fsm.dto.categorydto.CategoryDeleteRequestDto;
import com.example.fsm.dto.categorydto.CategoryIdDto;
import com.example.fsm.dto.categorydto.CategoryResponseDto;
import com.example.fsm.dto.categorydto.CreateCategoryDto;
import com.example.fsm.dto.categorydto.UpdateCategoryDto;
import com.example.fsm.entity.CategoryEntity;
import com.example.fsm.repository.CategoryRepository;
import com.example.fsm.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponseDto createCategory(CreateCategoryDto request) {

        CategoryEntity category = new CategoryEntity();

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setCreatedBy(request.getCreatedBy());
        category.setUpdatedBy(request.getUpdatedBy());

        CategoryEntity savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Override
    public CategoryResponseDto getCategoryById(CategoryIdDto request) {

        CategoryEntity category = categoryRepository
                .findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (Boolean.TRUE.equals(category.getDeleted())) {
            throw new RuntimeException("Category not found");
        }

        return mapToResponse(category);
    }

    @Override
    public List<CategoryResponseDto> getAllCategories() {

        return categoryRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CategoryResponseDto updateCategory(UpdateCategoryDto request) {

        CategoryEntity category = categoryRepository
                .findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (Boolean.TRUE.equals(category.getDeleted())) {
            throw new RuntimeException("Category not found");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setUpdatedBy(request.getUpdatedBy());

        CategoryEntity updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(CategoryDeleteRequestDto request) {

        CategoryEntity category = categoryRepository
                .findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (Boolean.TRUE.equals(category.getDeleted())) {
            throw new RuntimeException("Category not found");
        }

        category.setDeleted(true);
        category.setDeletedAt(LocalDateTime.now());
        category.setDeletedBy(request.getDeletedBy());

        categoryRepository.save(category);
    }

    private CategoryResponseDto mapToResponse(CategoryEntity category) {

        CategoryResponseDto response = new CategoryResponseDto();

        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());

        response.setCreatedAt(category.getCreatedAt());
        response.setCreatedBy(category.getCreatedBy());

        response.setUpdatedAt(category.getUpdatedAt());
        response.setUpdatedBy(category.getUpdatedBy());

        response.setDeleted(category.getDeleted());
        response.setDeletedAt(category.getDeletedAt());
        response.setDeletedBy(category.getDeletedBy());

        return response;
    }
}