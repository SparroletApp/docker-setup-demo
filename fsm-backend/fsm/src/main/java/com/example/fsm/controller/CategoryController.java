package com.example.fsm.controller;

import com.example.fsm.dto.categorydto.*;
import com.example.fsm.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<CategoryResponseDto> createCategory(
            @RequestBody CreateCategoryDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }

    @PostMapping("/get")
    public ResponseEntity<CategoryResponseDto> getCategoryById(
            @RequestBody CategoryIdDto request) {

        return ResponseEntity.ok(
                categoryService.getCategoryById(request)
        );
    }

    @PostMapping("/list")
    public ResponseEntity<List<CategoryResponseDto>> getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    @PostMapping("/update")
    public ResponseEntity<CategoryResponseDto> updateCategory(
            @RequestBody UpdateCategoryDto request) {

        return ResponseEntity.ok(
                categoryService.updateCategory(request)
        );
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteCategory(
            @RequestBody CategoryDeleteRequestDto request) {

        categoryService.deleteCategory(request);

        return ResponseEntity.noContent().build();
    }
}