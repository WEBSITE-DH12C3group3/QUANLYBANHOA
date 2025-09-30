package com.banhoa.backend.user;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Lấy user theo email (kèm roles & permissions) — dùng cho login
    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Lấy user theo id (kèm roles & permissions)
    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    Optional<User> findById(Integer id);
    @Query("""
    SELECT u FROM User u
    WHERE (:q IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%')))
""")
Page<User> search(String q, Pageable pageable);

}
