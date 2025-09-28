package com.banhoa.backend.product.mapper;

import com.banhoa.backend.product.dto.AttributeValueDTO;
import com.banhoa.backend.product.dto.ProductRequest;
import com.banhoa.backend.product.dto.ProductResponse;
import com.banhoa.backend.product.entity.*;

import java.util.ArrayList;
import java.util.List;

public class ProductMapper {

    public static void copyBasicFields(ProductRequest req, Product p) {
        p.setSku(req.getSku());
        p.setName(req.getName());
        p.setSlug(req.getSlug());
        p.setCategoryId(req.getCategoryId());
        p.setUnit(req.getUnit());
        p.setPrice(req.getPrice());
        p.setSalePrice(req.getSalePrice());
        p.setCostPrice(req.getCostPrice());
        p.setImageUrl(req.getImageUrl());
        p.setThumbnailUrl(req.getThumbnailUrl());
        p.setShortDesc(req.getShortDesc());
        p.setDescription(req.getDescription());
        p.setWeightKg(req.getWeightKg());
        p.setIsActive(req.getIsActive() != null ? req.getIsActive() : Boolean.TRUE);
    }

    public static ProductResponse toResponse(Product p, List<ProductAttribute> attrs) {
        ProductResponse res = new ProductResponse();
        res.setId(p.getId());
        res.setSku(p.getSku());
        res.setName(p.getName());
        res.setSlug(p.getSlug());
        res.setCategoryId(p.getCategoryId());
        res.setUnit(p.getUnit());
        res.setPrice(p.getPrice());
        res.setSalePrice(p.getSalePrice());
        res.setCostPrice(p.getCostPrice());
        res.setImageUrl(p.getImageUrl());
        res.setThumbnailUrl(p.getThumbnailUrl());
        res.setShortDesc(p.getShortDesc());
        res.setDescription(p.getDescription());
        res.setWeightKg(p.getWeightKg());
        res.setIsActive(p.getIsActive());
        res.setCreatedAt(p.getCreatedAt());
        res.setUpdatedAt(p.getUpdatedAt());

        List<AttributeValueDTO> list = new ArrayList<>();
        if (attrs != null) {
            for (ProductAttribute pa : attrs) {
                AttributeValueDTO dto = new AttributeValueDTO();
                dto.setAttributeId(pa.getAttribute().getId());
                dto.setValueText(pa.getValueText());
                dto.setValueNum(pa.getValueNum());
                dto.setValueBool(pa.getValueBool());
                dto.setValueDate(pa.getValueDate());
                list.add(dto);
            }
        }
        res.setAttributes(list);
        return res;
    }
}
