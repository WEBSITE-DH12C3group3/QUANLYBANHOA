package com.banhoa.backend.auth;

import com.banhoa.backend.security.JwtService;
import com.banhoa.backend.user.User;
import com.banhoa.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** ========== API Đăng ký ========== */
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User saved = authService.register(user);
        return ResponseEntity.ok(saved);
    }

    /** ========== API Đăng nhập ========== */
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    String password = body.get("password");

    System.out.println("📩 Login request email=" + email + ", password=" + password);

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        System.out.println("❌ Wrong password for user=" + email);
        return ResponseEntity.status(403).body("Sai email hoặc mật khẩu");
    }

    // ✅ Generate tokens
    Map<String, String> tokens = jwtService.generateTokens(user);

    // 🚀 Log token để kiểm tra
    System.out.println("✅ accessToken=" + tokens.get("accessToken"));
    System.out.println("✅ refreshToken=" + tokens.get("refreshToken"));

    // ✅ Build response
    Map<String, Object> res = new HashMap<>();
    res.put("id", user.getId());
    res.put("email", user.getEmail());
    res.put("fullName", user.getFullName());
    res.put("roles", user.getRoles().stream().map(r -> r.getName()).toList());
    res.put("permissions", user.getRoles().stream()
            .flatMap(r -> r.getPermissions().stream())
            .map(p -> p.getCode())
            .distinct()
            .toList());
    res.put("accessToken", tokens.get("accessToken"));
    res.put("refreshToken", tokens.get("refreshToken"));

    return ResponseEntity.ok(res);
}


    /** ========== API Refresh Token ========== */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");

        if (refreshToken == null || !jwtService.validateToken(refreshToken)) {
            return ResponseEntity.status(403).body("Invalid refresh token");
        }

        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, String> tokens = jwtService.generateTokens(user);

        Map<String, Object> res = new HashMap<>();
        res.put("accessToken", tokens.get("accessToken"));
        res.put("refreshToken", tokens.get("refreshToken"));

        return ResponseEntity.ok(res);
    }
}
