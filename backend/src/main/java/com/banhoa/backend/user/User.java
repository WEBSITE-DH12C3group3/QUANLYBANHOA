package com.banhoa.backend.user;

import com.banhoa.backend.role.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.banhoa.backend.common.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements org.springframework.security.core.userdetails.UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String email;
    private String phone;

    @Column(name = "full_name")
    private String fullName;

    // 👉 Raw password nhận từ FE (login, register)
    @Transient
    @JsonProperty("password")
    private String rawPassword;

    // 👉 Password hash lưu trong DB
    @Column(name = "password_hash")
    @JsonProperty("passwordHash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    /* ========== Spring Security ========== */

    @Override
    @JsonIgnore // 🚀 Không serialize vào JSON nữa
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
            role.getPermissions().forEach(p ->
                    authorities.add(new SimpleGrantedAuthority(p.getCode())));
        }
        return authorities;
    }

    @Override public boolean isAccountNonExpired() { return status == Status.active; }
    @Override public boolean isAccountNonLocked() { return status == Status.active; }
    @Override public boolean isCredentialsNonExpired() { return status == Status.active; }
    @Override public boolean isEnabled() { return status == Status.active; }
}
