package com.banhoa.backend.category.controller;

import com.banhoa.backend.category.dto.CategoryRequest;
import com.banhoa.backend.category.dto.CategoryResponse;
import com.banhoa.backend.category.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
public class CategoryAdminController {

    private final CategoryService service;

    public CategoryAdminController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Integer parentId
    ) {
        return ResponseEntity.ok(service.search(q, active, parentId, page, size));
    }

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryResponse>> tree(@RequestParam(defaultValue = "false") boolean activeOnly) {
        return ResponseEntity.ok(service.getTree(activeOnly));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(@PathVariable Integer id, @Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> setActive(@PathVariable Integer id, @RequestParam boolean value) {
        service.setActive(id, value);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }
}
