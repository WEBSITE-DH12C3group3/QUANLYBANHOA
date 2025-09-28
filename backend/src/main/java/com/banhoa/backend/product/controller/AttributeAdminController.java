package com.banhoa.backend.product.controller;

import com.banhoa.backend.product.entity.Attribute;
import com.banhoa.backend.product.repository.AttributeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/attributes")
public class AttributeAdminController {

    private final AttributeRepository repo;

    public AttributeAdminController(AttributeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<List<Attribute>> list() {
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    public ResponseEntity<Attribute> create(@RequestBody Attribute a) {
        return ResponseEntity.ok(repo.save(a));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attribute> update(@PathVariable Integer id, @RequestBody Attribute a) {
        a.setId(id);
        return ResponseEntity.ok(repo.save(a));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
