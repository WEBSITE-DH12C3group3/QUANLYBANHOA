package com.banhoa.backend.category.dto;

import jakarta.validation.constraints.*;

public class CategoryRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String slug;

    private Integer parentId;

    private Boolean isActive = Boolean.TRUE;

    @NotNull
    private Integer sortOrder = 0;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public Integer getParentId() { return parentId; }
    public void setParentId(Integer parentId) { this.parentId = parentId; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
