package com.banhoa.backend.purchase.mapper;

import com.banhoa.backend.purchase.dto.PurchaseOrderResponse;
import com.banhoa.backend.purchase.entity.PurchaseOrder;
import com.banhoa.backend.purchase.entity.PurchaseOrderItem;

import java.util.List;
import java.util.stream.Collectors;

public class PurchaseOrderMapper {
    public static PurchaseOrderResponse toResponse(PurchaseOrder po, List<PurchaseOrderItem> lines) {
        PurchaseOrderResponse res = new PurchaseOrderResponse();
        res.setId(po.getId());
        res.setCode(po.getCode());
        res.setSupplierId(po.getSupplierId());
        res.setStatus(po.getStatus());
        res.setExpectedDate(po.getExpectedDate());
        res.setSubtotal(po.getSubtotal());
        res.setDiscount(po.getDiscount());
        res.setTotal(po.getTotal());
        res.setNote(po.getNote());
        res.setCreatedBy(po.getCreatedBy());
        res.setCreatedAt(po.getCreatedAt());
        res.setUpdatedAt(po.getUpdatedAt());

        java.util.List<PurchaseOrderResponse.PurchaseOrderItemView> items =
                lines.stream().map(l -> {
                    PurchaseOrderResponse.PurchaseOrderItemView iv = new PurchaseOrderResponse.PurchaseOrderItemView();
                    iv.id = l.getId();
                    iv.productId = l.getProductId();
                    iv.qty = l.getQty();
                    iv.unitCost = l.getUnitCost();
                    iv.subtotal = l.getSubtotal();
                    return iv;
                }).collect(Collectors.toList());

        res.setItems(items);
        return res;
    }
}
