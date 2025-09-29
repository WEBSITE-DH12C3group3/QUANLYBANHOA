package com.banhoa.backend.category.mapper;

import com.banhoa.backend.category.dto.CategoryRequest;
import com.banhoa.backend.category.dto.CategoryResponse;
import com.banhoa.backend.category.entity.Category;

public class CategoryMapper {
    public static void copy(CategoryRequest req, Category c) {
        c.setName(req.getName());
        c.setSlug(req.getSlug());
        c.setParentId(req.getParentId());
        c.setIsActive(req.getIsActive() != null ? req.getIsActive() : Boolean.TRUE);
        c.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
    }

    public static CategoryResponse toResponse(Category c) {
        CategoryResponse res = new CategoryResponse();
        res.setId(c.getId());
        res.setName(c.getName());
        res.setSlug(c.getSlug());
        res.setParentId(c.getParentId());
        res.setIsActive(c.getIsActive());
        res.setSortOrder(c.getSortOrder());
        return res;
    }
}
