package com.banhoa.backend.category.controller;

import com.banhoa.backend.category.dto.CategoryResponse;
import com.banhoa.backend.category.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryPublicController {
    private final CategoryService service;

    public CategoryPublicController(CategoryService service) {
        this.service = service;
    }

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryResponse>> tree() {
        return ResponseEntity.ok(service.getTree(true));
    }
}
