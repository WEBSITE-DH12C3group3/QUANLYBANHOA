package com.banhoa.backend.category.repository;

import com.banhoa.backend.category.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsBySlug(String slug);

    @Query("SELECT c FROM Category c WHERE " +
           "(:q IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(c.slug) LIKE LOWER(CONCAT('%',:q,'%'))) AND " +
           "(:active IS NULL OR c.isActive = :active) AND " +
           "((:parentId IS NULL AND c.parentId IS NULL) OR (:parentId IS NOT NULL AND c.parentId = :parentId))")
    Page<Category> search(@Param("q") String q,
                          @Param("active") Boolean active,
                          @Param("parentId") Integer parentId,
                          Pageable pageable);

    List<Category> findAllByIsActiveTrueOrderBySortOrderAscNameAsc();
    List<Category> findAllByOrderBySortOrderAscNameAsc();
    List<Category> findByParentId(Integer parentId);
    long countByParentId(Integer parentId);
}
