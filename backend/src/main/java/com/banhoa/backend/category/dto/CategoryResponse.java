package com.banhoa.backend.category.dto;

import java.util.ArrayList;
import java.util.List;

public class CategoryResponse {
    private Integer id;
    private String name;
    private String slug;
    private Integer parentId;
    private Boolean isActive;
    private Integer sortOrder;

    // cho API tree:
    private List<CategoryResponse> children = new ArrayList<>();

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
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
    public List<CategoryResponse> getChildren() { return children; }
    public void setChildren(List<CategoryResponse> children) { this.children = children; }
}
