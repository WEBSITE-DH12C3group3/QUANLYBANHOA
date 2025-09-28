package com.banhoa.backend.product.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductAttributeId implements Serializable {
    private Integer productId;
    private Integer attributeId;

    public ProductAttributeId() {}
    public ProductAttributeId(Integer productId, Integer attributeId) {
        this.productId = productId;
        this.attributeId = attributeId;
    }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public Integer getAttributeId() { return attributeId; }
    public void setAttributeId(Integer attributeId) { this.attributeId = attributeId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductAttributeId)) return false;
        ProductAttributeId that = (ProductAttributeId) o;
        return java.util.Objects.equals(productId, that.productId) &&
               java.util.Objects.equals(attributeId, that.attributeId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(productId, attributeId);
    }
}
