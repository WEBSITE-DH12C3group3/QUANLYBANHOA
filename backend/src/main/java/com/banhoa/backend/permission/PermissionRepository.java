package com.banhoa.backend.permission;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {

    boolean existsByCode(String code);

    @Query("SELECT p FROM Permission p " +
           "WHERE (:q IS NULL OR LOWER(p.code) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Permission> search(String q, Pageable pageable);
}
