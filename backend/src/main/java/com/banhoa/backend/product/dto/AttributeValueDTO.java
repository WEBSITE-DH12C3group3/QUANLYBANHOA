package com.banhoa.backend.product.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AttributeValueDTO {
    private Integer attributeId;
    private String valueText;
    private BigDecimal valueNum;
    private Boolean valueBool;
    private LocalDate valueDate;

    public Integer getAttributeId() { return attributeId; }
    public void setAttributeId(Integer attributeId) { this.attributeId = attributeId; }
    public String getValueText() { return valueText; }
    public void setValueText(String valueText) { this.valueText = valueText; }
    public BigDecimal getValueNum() { return valueNum; }
    public void setValueNum(BigDecimal valueNum) { this.valueNum = valueNum; }
    public Boolean getValueBool() { return valueBool; }
    public void setValueBool(Boolean valueBool) { this.valueBool = valueBool; }
    public LocalDate getValueDate() { return valueDate; }
    public void setValueDate(LocalDate valueDate) { this.valueDate = valueDate; }
}
