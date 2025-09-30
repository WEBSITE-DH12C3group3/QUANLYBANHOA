package com.banhoa.backend.user;

import com.banhoa.backend.role.Role;
import com.banhoa.backend.role.RoleRepository;
import com.banhoa.backend.common.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Lấy danh sách user có phân trang + tìm kiếm
    @GetMapping
    public Page<User> searchUsers(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return userService.search(q, PageRequest.of(page, size));
    }

    // ✅ Lấy user theo id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Lấy profile user hiện tại
    @GetMapping("/me/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        Map<String, Object> res = new HashMap<>();
        res.put("id", user.getId());
        res.put("email", user.getEmail());
        res.put("fullName", user.getFullName());
        res.put("roles", user.getRoles().stream().map(Role::getName).toList());
        res.put("permissions", user.getRoles().stream()
                .flatMap(r -> r.getPermissions().stream())
                .map(p -> p.getCode())
                .distinct()
                .toList());

        return ResponseEntity.ok(res);
    }

    // ✅ Thêm user mới
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String fullName = (String) payload.get("fullName");
        String phone = (String) payload.get("phone");
        String rawPassword = (String) payload.get("password");

        List<Integer> roleIds = (List<Integer>) payload.get("roleIds");

        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setPasswordHash(passwordEncoder.encode(rawPassword)); // ✅ hash password
        user.setStatus(Status.active);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());

        if (roleIds != null) {
            Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));
            user.setRoles(roles);
        }

        return ResponseEntity.ok(userService.saveUser(user));
    }

    // ✅ Cập nhật user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        return userService.getUserById(id).map(user -> {
            if (payload.containsKey("fullName")) user.setFullName((String) payload.get("fullName"));
            if (payload.containsKey("phone")) user.setPhone((String) payload.get("phone"));
            if (payload.containsKey("status")) user.setStatus(Status.valueOf((String) payload.get("status")));
            if (payload.containsKey("password")) {
                String rawPassword = (String) payload.get("password");
                user.setPasswordHash(passwordEncoder.encode(rawPassword));
            }
            if (payload.containsKey("roleIds")) {
                List<Integer> roleIds = (List<Integer>) payload.get("roleIds");
                if (roleIds != null) {
                    Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));
                    user.setRoles(roles);
                }
            }
            user.setUpdatedAt(java.time.LocalDateTime.now());
            return ResponseEntity.ok(userService.saveUser(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Xóa user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
