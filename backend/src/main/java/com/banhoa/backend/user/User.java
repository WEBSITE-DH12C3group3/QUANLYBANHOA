package com.banhoa.backend.user;

import com.banhoa.backend.role.Role;
import com.banhoa.backend.common.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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

    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Status status; // active, inactive, banned

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
    public Set<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
        Set<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = new HashSet<>();
        for (Role role : roles) {
            authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role.getName()));
            role.getPermissions().forEach(p ->
                    authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(p.getCode())));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return status == Status.active;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status == Status.active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return status == Status.active;
    }

    @Override
    public boolean isEnabled() {
        return status == Status.active;
    }
}
