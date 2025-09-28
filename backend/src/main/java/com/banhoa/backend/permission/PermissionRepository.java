// PermissionRepository.java
package com.banhoa.backend.permission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
     boolean existsByCode(String code);
}
