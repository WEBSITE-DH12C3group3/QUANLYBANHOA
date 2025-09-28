package com.banhoa.backend.permission;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionRepository permissionRepository;

    // ✅ Lấy tất cả permissions
    @GetMapping
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }

    // ✅ Lấy permission theo id
    @GetMapping("/{id}")
    public ResponseEntity<Permission> getPermissionById(@PathVariable Integer id) {
        return permissionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Tạo permission mới
    @PostMapping
    public ResponseEntity<Permission> createPermission(@RequestBody Permission permission) {
        if (permission.getCode() == null || permission.getCode().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Permission saved = permissionRepository.save(permission);
        return ResponseEntity.ok(saved);
    }

    // ✅ Cập nhật permission
    @PutMapping("/{id}")
    public ResponseEntity<Permission> updatePermission(
            @PathVariable Integer id,
            @RequestBody Permission permission) {
        return permissionRepository.findById(id)
                .map(existing -> {
                    existing.setCode(permission.getCode());
                    existing.setDescription(permission.getDescription());
                    Permission updated = permissionRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Xóa permission
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Integer id) {
        if (!permissionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        permissionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
