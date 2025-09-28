package com.banhoa.backend.permission;

import com.banhoa.backend.role.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String code;   // Mã quyền (ví dụ: USER_VIEW, PRODUCT_EDIT)

    @Column
    private String description;  // Mô tả quyền

@ManyToMany(mappedBy = "permissions")
@JsonIgnore   // 👈 thêm dòng này
private Set<Role> roles = new HashSet<>();

}
