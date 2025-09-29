package com.banhoa.backend.supplier.mapper;

import com.banhoa.backend.purchase.entity.Supplier;
import com.banhoa.backend.supplier.dto.SupplierRequest;
import com.banhoa.backend.supplier.dto.SupplierResponse;

public class SupplierMapper {

    public static SupplierResponse toResponse(Supplier s) {
        SupplierResponse r = new SupplierResponse();
        r.setId(s.getId());
        r.setName(s.getName());
        r.setContactName(s.getContactName());
        r.setPhone(s.getPhone());
        r.setEmail(s.getEmail());
        r.setAddress(s.getAddress());
        r.setTaxCode(s.getTaxCode());
        r.setStatus(s.getStatus());
        r.setNote(s.getNote());
        return r;
    }

    public static void apply(Supplier s, SupplierRequest req) {
        s.setName(req.getName());
        s.setContactName(req.getContactName());
        s.setPhone(req.getPhone());
        s.setEmail(req.getEmail());
        s.setAddress(req.getAddress());
        s.setTaxCode(req.getTaxCode());
        s.setStatus(req.getStatus());
        s.setNote(req.getNote());
    }
}
