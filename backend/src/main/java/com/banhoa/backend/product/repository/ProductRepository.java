package com.banhoa.backend.product.repository;

import com.banhoa.backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsBySku(String sku);
    boolean existsBySlug(String slug);
    long countByCategoryId(Integer categoryId);

    @Query("SELECT p FROM Product p " +
           "WHERE (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:categoryId IS NULL OR p.categoryId = :categoryId) " +
           "AND (:active IS NULL OR p.isActive = :active) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND ( :attrId IS NULL OR EXISTS ( " +
           "     SELECT 1 FROM ProductAttribute pa WHERE pa.product = p AND pa.attribute.id = :attrId " +
           "     AND ( " +
           "          (:attrText IS NOT NULL AND pa.valueText IS NOT NULL AND LOWER(pa.valueText) LIKE LOWER(CONCAT('%', :attrText, '%'))) " +
           "       OR (:attrNumMin IS NOT NULL AND pa.valueNum IS NOT NULL AND pa.valueNum >= :attrNumMin) " +
           "       OR (:attrNumMax IS NOT NULL AND pa.valueNum IS NOT NULL AND pa.valueNum <= :attrNumMax) " +
           "       OR (:attrText IS NULL AND :attrNumMin IS NULL AND :attrNumMax IS NULL) " +
           "        ) " +
           "   ) " +
           ")")
    Page<Product> search(
            @Param("q") String q,
            @Param("categoryId") Integer categoryId,
            @Param("active") Boolean active,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("attrId") Integer attrId,
            @Param("attrText") String attrText,
            @Param("attrNumMin") BigDecimal attrNumMin,
            @Param("attrNumMax") BigDecimal attrNumMax,
            Pageable pageable);
}
