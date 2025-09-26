package com.banhoa.backend.auth;

import com.banhoa.backend.role.Role;
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
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /** Đăng ký tài khoản mới (mặc định role = customer) */
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Hash mật khẩu từ rawPassword
        user.setPasswordHash(passwordEncoder.encode(user.getRawPassword()));
        user.setRawPassword(null); // xoá raw password cho an toàn
        user.setStatus(Status.active);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Gán mặc định role customer
        Role role = new Role();
        role.setId(3); // giả định role_id = 3 là "customer"
        user.getRoles().add(role);

        return userRepository.save(user);
    }

    /** Đăng nhập trả về token + thông tin */
    public Map<String, Object> login(User reqUser) {
        User dbUser = userRepository.findByEmail(reqUser.getEmail())
                .orElseThrow(() -> new RuntimeException("Sai email hoặc mật khẩu"));

        // ✅ Lấy password từ rawPassword (FE gửi) hoặc fallback passwordHash (Postman test)
        String rawPassword = reqUser.getRawPassword();
        if (rawPassword == null) rawPassword = reqUser.getPasswordHash();

        if (rawPassword == null || !passwordEncoder.matches(rawPassword, dbUser.getPasswordHash())) {
            throw new RuntimeException("Sai email hoặc mật khẩu");
        }

        // Sinh JWT token
        String token = jwtService.generateToken(dbUser);

        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("email", dbUser.getEmail());
        res.put("fullName", dbUser.getFullName());
        res.put("roles", dbUser.getRoles().stream().map(Role::getName).toList());
        res.put("permissions", dbUser.getRoles().stream()
                .flatMap(r -> r.getPermissions().stream())
                .map(p -> p.getCode())
                .distinct()
                .toList());

        return res;
    }
}
