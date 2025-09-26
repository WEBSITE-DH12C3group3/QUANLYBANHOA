package com.banhoa.backend.user;

import com.banhoa.backend.role.Role;
import com.banhoa.backend.role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    // ✅ Lấy tất cả user
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Lấy user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Lấy profile user đang đăng nhập
    @GetMapping("/me/profile")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal UserDetails principal) {
        return userService.getUserByEmail(principal.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Tạo user mới + gán role
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String fullName = (String) payload.get("fullName");
        String phone = (String) payload.get("phone");
        String passwordHash = (String) payload.get("passwordHash"); // đã hash trước khi gửi

        List<Integer> roleIds = (List<Integer>) payload.get("roleIds");

        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setPasswordHash(passwordHash);
        user.setStatus(com.banhoa.backend.common.Status.active);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());

        Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));
        user.setRoles(roles);

        return ResponseEntity.ok(userService.saveUser(user));
    }

    // ✅ Cập nhật user (gồm roles)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        return userService.getUserById(id).map(user -> {
            if (payload.containsKey("fullName")) user.setFullName((String) payload.get("fullName"));
            if (payload.containsKey("phone")) user.setPhone((String) payload.get("phone"));
            if (payload.containsKey("status")) user.setStatus(com.banhoa.backend.common.Status.valueOf((String) payload.get("status")));
            if (payload.containsKey("roleIds")) {
                List<Integer> roleIds = (List<Integer>) payload.get("roleIds");
                Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));
                user.setRoles(roles);
            }
            user.setUpdatedAt(java.time.LocalDateTime.now());
            return ResponseEntity.ok(userService.saveUser(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Xóa user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
