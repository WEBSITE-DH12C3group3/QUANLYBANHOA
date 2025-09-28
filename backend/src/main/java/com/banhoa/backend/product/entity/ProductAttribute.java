package com.banhoa.backend.product.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "product_attribute")
public class ProductAttribute {
    @EmbeddedId
    private ProductAttributeId id = new ProductAttributeId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "fk_pa_prod"))
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("attributeId")
    @JoinColumn(name = "attribute_id", nullable = false, foreignKey = @ForeignKey(name = "fk_pa_attr"))
    private Attribute attribute;

    @Column(name = "value_text")
    private String valueText;

    @Column(name = "value_num", precision = 18, scale = 6)
    private BigDecimal valueNum;

    @Column(name = "value_bool")
    private Boolean valueBool;

    @Column(name = "value_date")
    private java.time.LocalDate valueDate;

    public ProductAttributeId getId() { return id; }
    public void setId(ProductAttributeId id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Attribute getAttribute() { return attribute; }
    public void setAttribute(Attribute attribute) { this.attribute = attribute; }
    public String getValueText() { return valueText; }
    public void setValueText(String valueText) { this.valueText = valueText; }
    public BigDecimal getValueNum() { return valueNum; }
    public void setValueNum(BigDecimal valueNum) { this.valueNum = valueNum; }
    public Boolean getValueBool() { return valueBool; }
    public void setValueBool(Boolean valueBool) { this.valueBool = valueBool; }
    public java.time.LocalDate getValueDate() { return valueDate; }
    public void setValueDate(java.time.LocalDate valueDate) { this.valueDate = valueDate; }
}
