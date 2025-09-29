package com.banhoa.backend.supplier.controller;

import com.banhoa.backend.supplier.dto.SupplierRequest;
import com.banhoa.backend.supplier.dto.SupplierResponse;
import com.banhoa.backend.supplier.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/suppliers")
public class SupplierAdminController {

    private final SupplierService service;

    public SupplierAdminController(SupplierService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<SupplierResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(service.search(q, status, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> get(@PathVariable Integer id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PostMapping
    public ResponseEntity<SupplierResponse> create(@Valid @RequestBody SupplierRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> update(@PathVariable Integer id, @Valid @RequestBody SupplierRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
