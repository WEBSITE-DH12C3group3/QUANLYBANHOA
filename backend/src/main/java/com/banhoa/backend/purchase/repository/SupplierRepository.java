package com.banhoa.backend.purchase.repository;

import com.banhoa.backend.purchase.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

    boolean existsByNameIgnoreCase(String name);

    @Query("""
        SELECT s FROM Supplier s
        WHERE (:q IS NULL OR
               LOWER(s.name) LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(s.contactName) LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(s.phone) LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(s.email) LIKE LOWER(CONCAT('%', :q, '%')))
          AND (:status IS NULL OR s.status = :status)
    """)
    Page<Supplier> search(@Param("q") String q,
                          @Param("status") String status,
                          Pageable pageable);
}
