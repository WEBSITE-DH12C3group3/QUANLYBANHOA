package com.banhoa.backend.product.service;

import com.banhoa.backend.product.dto.AttributeValueDTO;
import com.banhoa.backend.product.dto.ProductRequest;
import com.banhoa.backend.product.dto.ProductResponse;
import com.banhoa.backend.product.entity.*;
import com.banhoa.backend.product.mapper.ProductMapper;
import com.banhoa.backend.product.repository.AttributeRepository;
import com.banhoa.backend.product.repository.ProductAttributeRepository;
import com.banhoa.backend.product.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ProductService {

    private final ProductRepository productRepo;
    private final AttributeRepository attrRepo;
    private final ProductAttributeRepository paRepo;

    public ProductService(ProductRepository productRepo, AttributeRepository attrRepo, ProductAttributeRepository paRepo) {
        this.productRepo = productRepo;
        this.attrRepo = attrRepo;
        this.paRepo = paRepo;
    }

    public Page<ProductResponse> search(String q, Integer categoryId, Boolean active,
                                        BigDecimal minPrice, BigDecimal maxPrice,
                                        Integer attrId, String attrText, BigDecimal attrNumMin, BigDecimal attrNumMax,
                                        Pageable pageable) {
        Page<Product> page = productRepo.search(
                StringUtils.hasText(q) ? q.trim() : null,
                categoryId, active, minPrice, maxPrice, attrId,
                StringUtils.hasText(attrText) ? attrText.trim() : null,
                attrNumMin, attrNumMax, pageable
        );
        return page.map(p -> ProductMapper.toResponse(p, paRepo.findByIdProductId(p.getId())));
    }

    public ProductResponse getById(Integer id) {
        Product p = productRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Product not found"));
        return ProductMapper.toResponse(p, paRepo.findByIdProductId(p.getId()));
    }

    @Transactional
    public ProductResponse create(ProductRequest req) {
        Product p = new Product();
        ProductMapper.copyBasicFields(req, p);

        if (productRepo.existsBySku(p.getSku())) throw new IllegalArgumentException("SKU đã tồn tại");
        if (productRepo.existsBySlug(p.getSlug())) throw new IllegalArgumentException("Slug đã tồn tại");

        p = productRepo.save(p);
        upsertAttributes(p, req.getAttributes());
        return ProductMapper.toResponse(p, paRepo.findByIdProductId(p.getId()));
    }

    @Transactional
    public ProductResponse update(Integer id, ProductRequest req) {
        Product p = productRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Product not found"));
        ProductMapper.copyBasicFields(req, p);
        p = productRepo.save(p);

        java.util.List<ProductAttribute> old = paRepo.findByIdProductId(p.getId());
        paRepo.deleteAll(old);
        upsertAttributes(p, req.getAttributes());

        return ProductMapper.toResponse(p, paRepo.findByIdProductId(p.getId()));
    }

    @Transactional
    public void setActive(Integer id, boolean active) {
        Product p = productRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Product not found"));
        p.setIsActive(active);
        productRepo.save(p);
    }

    @Transactional
    public void softDelete(Integer id) { setActive(id, false); }

    @Transactional
    public ProductResponse cloneProduct(Integer id) {
        Product src = productRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Product not found"));
        Product copy = new Product();
        copy.setSku(makeUnique(src.getSku() + "-copy", true));
        copy.setName(src.getName() + " (Copy)");
        copy.setSlug(makeUnique(src.getSlug() + "-copy", false));
        copy.setCategoryId(src.getCategoryId());
        copy.setUnit(src.getUnit());
        copy.setPrice(src.getPrice());
        copy.setSalePrice(src.getSalePrice());
        copy.setCostPrice(src.getCostPrice());
        copy.setImageUrl(src.getImageUrl());
        copy.setThumbnailUrl(src.getThumbnailUrl());
        copy.setShortDesc(src.getShortDesc());
        copy.setDescription(src.getDescription());
        copy.setWeightKg(src.getWeightKg());
        copy.setIsActive(false);
        copy = productRepo.save(copy);

        for (ProductAttribute pa : paRepo.findByIdProductId(src.getId())) {
            ProductAttribute clone = new ProductAttribute();
            clone.setProduct(copy);
            clone.setAttribute(pa.getAttribute());
            clone.setId(new ProductAttributeId(copy.getId(), pa.getAttribute().getId()));
            clone.setValueText(pa.getValueText());
            clone.setValueNum(pa.getValueNum());
            clone.setValueBool(pa.getValueBool());
            clone.setValueDate(pa.getValueDate());
            paRepo.save(clone);
        }
        return ProductMapper.toResponse(copy, paRepo.findByIdProductId(copy.getId()));
    }

    public byte[] exportCsv(java.util.List<ProductResponse> rows) {
        String[] header = {"id","sku","name","slug","categoryId","price","salePrice","isActive","createdAt","updatedAt"};
        StringBuilder sb = new StringBuilder();
        sb.append(String.join(",", header)).append("\n");
        for (ProductResponse p : rows) {
            sb.append(p.getId()).append(',');
            sb.append(csv(p.getSku())).append(',');
            sb.append(csv(p.getName())).append(',');
            sb.append(csv(p.getSlug())).append(',');
            sb.append(p.getCategoryId() == null ? "" : p.getCategoryId()).append(',');
            sb.append(p.getPrice() == null ? "" : p.getPrice()).append(',');
            sb.append(p.getSalePrice() == null ? "" : p.getSalePrice()).append(',');
            sb.append(Boolean.TRUE.equals(p.getIsActive()) ? "true" : "false").append(',');
            sb.append(p.getCreatedAt() == null ? "" : p.getCreatedAt()).append(',');
            sb.append(p.getUpdatedAt() == null ? "" : p.getUpdatedAt()).append('\n');
        }
        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private String csv(String s) {
        if (s == null) return "";
        String x = s.replace('"','\"');
        return '"' + x + '"';
    }

    private void upsertAttributes(Product p, java.util.List<AttributeValueDTO> list) {
        if (list == null || list.isEmpty()) return;
        for (AttributeValueDTO dto : list) {
            Attribute attr = attrRepo.findById(dto.getAttributeId())
                    .orElseThrow(() -> new IllegalArgumentException("Thuộc tính không tồn tại: " + dto.getAttributeId()));

            ProductAttribute pa = new ProductAttribute();
            pa.setProduct(p);
            pa.setAttribute(attr);
            pa.setId(new ProductAttributeId(p.getId(), attr.getId()));
            pa.setValueText(dto.getValueText());
            pa.setValueNum(dto.getValueNum());
            pa.setValueBool(dto.getValueBool());
            pa.setValueDate(dto.getValueDate());
            paRepo.save(pa);
        }
    }

    private String makeUnique(String base, boolean sku) {
        String cand = base;
        int i = 1;
        while ((sku && productRepo.existsBySku(cand)) || (!sku && productRepo.existsBySlug(cand))) {
            cand = base + "-" + (i++);
        }
        return cand;
    }
    @org.springframework.transaction.annotation.Transactional
    public void hardDelete(Integer id) {
    if (!productRepo.existsById(id)) return;
    productRepo.deleteById(id);
    }
}
