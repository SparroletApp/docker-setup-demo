package com.example.fsm.service;

import com.example.fsm.dto.categorydto.CategoryDeleteRequestDto;
import com.example.fsm.dto.categorydto.CategoryIdDto;
import com.example.fsm.dto.categorydto.CategoryResponseDto;
import com.example.fsm.dto.categorydto.CreateCategoryDto;
import com.example.fsm.dto.categorydto.UpdateCategoryDto;

import java.util.List;

public interface CategoryService {

    CategoryResponseDto createCategory(CreateCategoryDto request);

    CategoryResponseDto getCategoryById(CategoryIdDto request);

    List<CategoryResponseDto> getAllCategories();

    CategoryResponseDto updateCategory(UpdateCategoryDto request);

    void deleteCategory(CategoryDeleteRequestDto request);
}