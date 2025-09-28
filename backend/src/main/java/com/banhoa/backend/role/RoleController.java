package com.banhoa.backend.role;

import com.banhoa.backend.permission.Permission;
import com.banhoa.backend.permission.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    // ✅ Lấy tất cả roles
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    // ✅ Lấy role theo id
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Integer id) {
        return roleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Thêm role mới
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        List<Integer> permissionIds = (List<Integer>) body.get("permissionIds");

        Role role = new Role();
        role.setName(name);

        if (permissionIds != null) {
            List<Permission> permissions = permissionRepository.findAllById(permissionIds);
            role.setPermissions(new HashSet<>(permissions)); // ✅ ép sang Set
        }

        return ResponseEntity.ok(roleRepository.save(role));
    }

    // ✅ Sửa role
    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {

        return roleRepository.findById(id).map(role -> {
            // cập nhật name
            if (body.containsKey("name")) {
                role.setName((String) body.get("name"));
            }

            // cập nhật permissions
            if (body.containsKey("permissionIds")) {
                List<Integer> permissionIds = (List<Integer>) body.get("permissionIds");
                if (permissionIds != null) {
                    List<Permission> permissions = permissionRepository.findAllById(permissionIds);
                    role.setPermissions(new HashSet<>(permissions)); // convert List -> Set
                }
            }

            return ResponseEntity.ok(roleRepository.save(role));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Xóa role
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        if (!roleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        roleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
