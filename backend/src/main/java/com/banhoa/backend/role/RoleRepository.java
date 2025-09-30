// RoleRepository.java
package com.banhoa.backend.role;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByNameIgnoreCase(String name);
    @Query("""
        SELECT r FROM Role r
        WHERE (:q IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :q, '%')))
    """)
    Page<Role> search(String q, Pageable pageable);
}
