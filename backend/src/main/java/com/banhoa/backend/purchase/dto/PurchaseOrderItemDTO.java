package com.banhoa.backend.purchase.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PurchaseOrderItemDTO {
    @NotNull
    private Integer productId;
    @NotNull @Positive
    private Integer qty;
    @NotNull @DecimalMin("0.0")
    private BigDecimal unitCost;

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }
}
