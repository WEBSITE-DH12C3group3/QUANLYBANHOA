package com.banhoa.backend.purchase.controller;

import com.banhoa.backend.purchase.dto.PurchaseOrderRequest;
import com.banhoa.backend.purchase.dto.PurchaseOrderResponse;
import com.banhoa.backend.purchase.entity.PurchaseOrderStatus;
import com.banhoa.backend.purchase.service.PurchaseOrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/purchase-orders")
public class PurchaseOrderAdminController {
    private final PurchaseOrderService service;
    public PurchaseOrderAdminController(PurchaseOrderService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<Page<PurchaseOrderResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) PurchaseOrderStatus status,
            @RequestParam(required = false) Integer supplierId
    ) {
        return ResponseEntity.ok(service.search(q, status, supplierId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponse> get(@PathVariable Integer id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderResponse> create(@RequestParam Integer userId, @Valid @RequestBody PurchaseOrderRequest req) {
        return ResponseEntity.ok(service.create(userId, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponse> update(@PathVariable Integer id, @Valid @RequestBody PurchaseOrderRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(@PathVariable Integer id, @RequestParam PurchaseOrderStatus value) {
        service.changeStatus(id, value);
        return ResponseEntity.noContent().build();
    }
}
