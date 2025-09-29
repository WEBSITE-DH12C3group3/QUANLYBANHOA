package com.banhoa.backend.purchase.repository;

import com.banhoa.backend.purchase.entity.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, Integer> {
    java.util.List<PurchaseOrderItem> findByPurchaseOrderId(Integer purchaseOrderId);
    void deleteByPurchaseOrderId(Integer purchaseOrderId);
    long countByPurchaseOrderId(Integer purchaseOrderId);
}
