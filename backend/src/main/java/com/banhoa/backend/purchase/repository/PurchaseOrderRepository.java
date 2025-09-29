package com.banhoa.backend.purchase.repository;

import com.banhoa.backend.purchase.entity.PurchaseOrder;
import com.banhoa.backend.purchase.entity.PurchaseOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
    boolean existsByCode(String code);

    @Query("SELECT p FROM PurchaseOrder p WHERE " +
           "(:q IS NULL OR LOWER(p.code) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(p.note) LIKE LOWER(CONCAT('%',:q,'%'))) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:supplierId IS NULL OR p.supplierId = :supplierId)")
    Page<PurchaseOrder> search(@Param("q") String q,
                               @Param("status") PurchaseOrderStatus status,
                               @Param("supplierId") Integer supplierId,
                               Pageable pageable);
}
