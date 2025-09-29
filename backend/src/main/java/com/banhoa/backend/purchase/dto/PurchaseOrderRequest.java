package com.banhoa.backend.purchase.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.time.LocalDate;
import java.math.BigDecimal;

public class PurchaseOrderRequest {
    @NotNull
    private Integer supplierId;

    private String note;

    private LocalDate expectedDate;

    @NotNull
    private List<PurchaseOrderItemDTO> items;

    private BigDecimal discount;

    public Integer getSupplierId() { return supplierId; }
    public void setSupplierId(Integer supplierId) { this.supplierId = supplierId; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public LocalDate getExpectedDate() { return expectedDate; }
    public void setExpectedDate(LocalDate expectedDate) { this.expectedDate = expectedDate; }
    public List<PurchaseOrderItemDTO> getItems() { return items; }
    public void setItems(List<PurchaseOrderItemDTO> items) { this.items = items; }
    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
}
