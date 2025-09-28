package com.banhoa.backend.catalog.controller;

import com.banhoa.backend.catalog.entity.Category;
import com.banhoa.backend.catalog.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
public class CategoryAdminController {

    private final CategoryRepository repo;

    public CategoryAdminController(CategoryRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<List<Category>> listActive() {
        return ResponseEntity.ok(repo.findByIsActiveTrueOrderBySortOrderAscNameAsc());
    }
}
