package com.banhoa.backend.supplier.service;

import com.banhoa.backend.purchase.entity.Supplier;
import com.banhoa.backend.supplier.dto.SupplierRequest;
import com.banhoa.backend.supplier.dto.SupplierResponse;
import com.banhoa.backend.supplier.mapper.SupplierMapper;
import com.banhoa.backend.purchase.repository.SupplierRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.NoSuchElementException;

@Service
public class SupplierService {

    private final SupplierRepository repo;

    public SupplierService(SupplierRepository repo) {
        this.repo = repo;
    }

    public Page<SupplierResponse> search(String q, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("name")));
        Page<Supplier> p = repo.search(normalize(q), normalize(status), pageable);
        return p.map(SupplierMapper::toResponse);
    }

    public SupplierResponse get(Integer id) {
        Supplier s = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Supplier not found"));
        return SupplierMapper.toResponse(s);
    }

    @Transactional
    public SupplierResponse create(SupplierRequest req) {
        // name unique (nếu muốn nới lỏng thì bỏ điều kiện này)
        if (repo.existsByNameIgnoreCase(req.getName())) {
            throw new IllegalArgumentException("Tên nhà cung cấp đã tồn tại");
        }
        Supplier s = new Supplier();
        SupplierMapper.apply(s, req);
        repo.save(s);
        return SupplierMapper.toResponse(s);
    }

    @Transactional
    public SupplierResponse update(Integer id, SupplierRequest req) {
        Supplier s = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Supplier not found"));

        // nếu đổi tên → check trùng
        if (req.getName() != null && !req.getName().equalsIgnoreCase(s.getName())
                && repo.existsByNameIgnoreCase(req.getName())) {
            throw new IllegalArgumentException("Tên nhà cung cấp đã tồn tại");
        }

        SupplierMapper.apply(s, req);
        repo.save(s);
        return SupplierMapper.toResponse(s);
    }

    @Transactional
    public void delete(Integer id) {
        if (!repo.existsById(id)) throw new NoSuchElementException("Supplier not found");
        try {
            repo.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            // Ví dụ có ràng buộc từ purchase_orders.supplier_id → trả 409 thân thiện
            throw new IllegalStateException("Không thể xóa: nhà cung cấp đã được sử dụng trong chứng từ.");
        }
    }

    /* helpers */
    private String normalize(String s) {
        if (!StringUtils.hasText(s)) return null;
        return s.trim();
    }
}
