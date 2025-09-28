package com.banhoa.backend.product.repository;

import com.banhoa.backend.product.entity.ProductAttribute;
import com.banhoa.backend.product.entity.ProductAttributeId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, ProductAttributeId> {
    List<ProductAttribute> findByIdProductId(Integer productId);
}
