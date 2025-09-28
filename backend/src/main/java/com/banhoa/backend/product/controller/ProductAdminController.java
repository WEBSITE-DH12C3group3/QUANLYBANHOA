package com.banhoa.backend.product.controller;

import com.banhoa.backend.product.dto.ProductRequest;
import com.banhoa.backend.product.dto.ProductResponse;
import com.banhoa.backend.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/admin/products")
public class ProductAdminController {

    private final ProductService service;

    public ProductAdminController(ProductService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> list(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "attrId", required = false) Integer attrId,
            @RequestParam(value = "attrText", required = false) String attrText,
            @RequestParam(value = "attrNumMin", required = false) BigDecimal attrNumMin,
            @RequestParam(value = "attrNumMax", required = false) BigDecimal attrNumMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        String[] parts = sort.split(",");
        Sort.Direction dir = (parts.length > 1 && parts[1].equalsIgnoreCase("asc")) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, parts[0]));
        return ResponseEntity.ok(service.search(q, categoryId, active, minPrice, maxPrice, attrId, attrText, attrNumMin, attrNumMax, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Integer id) { return ResponseEntity.ok(service.getById(id)); }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@RequestBody @Valid ProductRequest req) { return ResponseEntity.ok(service.create(req)); }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Integer id, @RequestBody @Valid ProductRequest req) { return ResponseEntity.ok(service.update(id, req)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { service.softDelete(id); return ResponseEntity.noContent().build(); }

    @PatchMapping(value = "/{id}/active", consumes = "application/json")
    public org.springframework.http.ResponseEntity<Void> toggleJson(
        @PathVariable Integer id,
        @org.springframework.web.bind.annotation.RequestBody java.util.Map<String,Object> body) {

    Object v = body.get("value");
    boolean value = (v instanceof Boolean) ? (Boolean) v : Boolean.parseBoolean(String.valueOf(v));
    service.setActive(id, value);
    return org.springframework.http.ResponseEntity.noContent().build();
    }



    @PostMapping("/{id}/clone")
    public ResponseEntity<ProductResponse> cloneProduct(@PathVariable Integer id) { return ResponseEntity.ok(service.cloneProduct(id)); }

    @GetMapping(value = "/export.csv", produces = "text/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "attrId", required = false) Integer attrId,
            @RequestParam(value = "attrText", required = false) String attrText,
            @RequestParam(value = "attrNumMin", required = false) BigDecimal attrNumMin,
            @RequestParam(value = "attrNumMax", required = false) BigDecimal attrNumMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        String[] parts = sort.split(",");
        Sort.Direction dir = (parts.length > 1 && parts[1].equalsIgnoreCase("asc")) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, parts[0]));
        Page<ProductResponse> p = service.search(q, categoryId, active, minPrice, maxPrice, attrId, attrText, attrNumMin, attrNumMax, pageable);
        byte[] csv = service.exportCsv(p.getContent());
        String filename = java.net.URLEncoder.encode("products.csv", java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + filename)
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }
    @DeleteMapping("/{id}/hard")
    public org.springframework.http.ResponseEntity<Void> hardDelete(@PathVariable Integer id) {
    service.hardDelete(id);
    return org.springframework.http.ResponseEntity.noContent().build();
    }

}
