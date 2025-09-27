package com.banhoa.backend.auth;

import com.banhoa.backend.role.Role;
import com.banhoa.backend.role.RoleRepository;
import com.banhoa.backend.user.User;
import com.banhoa.backend.user.UserRepository;
import com.banhoa.backend.security.JwtService;
import com.banhoa.backend.common.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /** Đăng ký tài khoản mới (mặc định role = customer) */
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Hash mật khẩu từ rawPassword
        user.setPasswordHash(passwordEncoder.encode(user.getRawPassword()));
        user.setStatus(Status.active);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Gán mặc định role customer
        Role role = roleRepository.findByNameIgnoreCase("customer")
                .orElseThrow(() -> new RuntimeException("Role 'customer' not found"));
        user.getRoles().add(role);

        return userRepository.save(user);
    }

    /** Đăng nhập trả về accessToken + refreshToken + thông tin user */
    public Map<String, Object> login(String email, String rawPassword) {
        User dbUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu"));

        // So khớp mật khẩu
        if (!passwordEncoder.matches(rawPassword, dbUser.getPassword())) {
            throw new RuntimeException("Sai email hoặc mật khẩu");
        }

        // Sinh JWT tokens
        Map<String, String> tokens = jwtService.generateTokens(dbUser);

        Map<String, Object> res = new HashMap<>();
        res.put("id", dbUser.getId());
        res.put("email", dbUser.getEmail());
        res.put("fullName", dbUser.getFullName());
        res.put("roles", dbUser.getRoles().stream().map(Role::getName).toList());
        res.put("permissions", dbUser.getRoles().stream()
                .flatMap(r -> r.getPermissions().stream())
                .map(p -> p.getCode())
                .distinct()
                .toList());
        res.put("accessToken", tokens.get("accessToken"));
        res.put("refreshToken", tokens.get("refreshToken"));

        return res;
    }
}
