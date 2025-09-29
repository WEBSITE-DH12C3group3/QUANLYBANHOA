package com.banhoa.backend.purchase.service;

import com.banhoa.backend.purchase.dto.PurchaseOrderItemDTO;
import com.banhoa.backend.purchase.dto.PurchaseOrderRequest;
import com.banhoa.backend.purchase.dto.PurchaseOrderResponse;
import com.banhoa.backend.purchase.entity.PurchaseOrder;
import com.banhoa.backend.purchase.entity.PurchaseOrderItem;
import com.banhoa.backend.purchase.entity.PurchaseOrderStatus;
import com.banhoa.backend.purchase.mapper.PurchaseOrderMapper;
import com.banhoa.backend.purchase.repository.PurchaseOrderItemRepository;
import com.banhoa.backend.purchase.repository.PurchaseOrderRepository;
import com.banhoa.backend.purchase.repository.SupplierRepository;
import com.banhoa.backend.product.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository repo;
    private final PurchaseOrderItemRepository itemRepo;
    private final SupplierRepository supplierRepo;
    private final ProductRepository productRepo;

    public PurchaseOrderService(PurchaseOrderRepository repo,
                                PurchaseOrderItemRepository itemRepo,
                                SupplierRepository supplierRepo,
                                ProductRepository productRepo) {
        this.repo = repo;
        this.itemRepo = itemRepo;
        this.supplierRepo = supplierRepo;
        this.productRepo = productRepo;
    }

    public Page<PurchaseOrderResponse> search(String q, PurchaseOrderStatus status, Integer supplierId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        Page<PurchaseOrder> pos = repo.search(normalize(q), status, supplierId, pageable);
        return pos.map(po -> PurchaseOrderMapper.toResponse(po, itemRepo.findByPurchaseOrderId(po.getId())));
    }

    public PurchaseOrderResponse get(Integer id) {
        PurchaseOrder po = repo.findById(id).orElseThrow(() -> new NoSuchElementException("PO not found"));
        java.util.List<PurchaseOrderItem> items = itemRepo.findByPurchaseOrderId(id);
        return PurchaseOrderMapper.toResponse(po, items);
    }

    @Transactional
    public PurchaseOrderResponse create(Integer userId, PurchaseOrderRequest req) {
        ensureSupplierExists(req.getSupplierId());
        validateItems(req.getItems());

        PurchaseOrder po = new PurchaseOrder();
        po.setCode(generateCode());
        po.setSupplierId(req.getSupplierId());
        po.setStatus(PurchaseOrderStatus.draft);
        po.setExpectedDate(req.getExpectedDate());
        po.setNote(req.getNote());
        po.setCreatedBy(userId);

        repo.save(po);
        upsertItemsAndTotals(po, req.getItems(), req.getDiscount());

        return get(po.getId());
    }

    @Transactional
    public PurchaseOrderResponse update(Integer id, PurchaseOrderRequest req) {
        PurchaseOrder po = repo.findById(id).orElseThrow(() -> new NoSuchElementException("PO not found"));
        if (po.getStatus() == PurchaseOrderStatus.received || po.getStatus() == PurchaseOrderStatus.cancelled) {
            throw new IllegalStateException("Không thể sửa PO đã received/cancelled");
        }
        ensureSupplierExists(req.getSupplierId());
        validateItems(req.getItems());

        po.setSupplierId(req.getSupplierId());
        po.setExpectedDate(req.getExpectedDate());
        po.setNote(req.getNote());
        repo.save(po);

        // replace all lines
        itemRepo.deleteByPurchaseOrderId(id);
        upsertItemsAndTotals(po, req.getItems(), req.getDiscount());

        return get(id);
    }

    @Transactional
    public void changeStatus(Integer id, PurchaseOrderStatus newStatus) {
        PurchaseOrder po = repo.findById(id).orElseThrow(() -> new NoSuchElementException("PO not found"));
        PurchaseOrderStatus old = po.getStatus();
        if (old == newStatus) return;

        // allowed transitions
        boolean ok = switch (old) {
            case draft -> (newStatus == PurchaseOrderStatus.ordered || newStatus == PurchaseOrderStatus.cancelled);
            case ordered -> (newStatus == PurchaseOrderStatus.received || newStatus == PurchaseOrderStatus.cancelled);
            default -> false;
        };
        if (!ok) throw new IllegalStateException("Chuyển trạng thái không hợp lệ: " + old + " -> " + newStatus);

        po.setStatus(newStatus);
        repo.save(po);

        // Nếu schema có tồn kho thì update ở đây. Hiện chưa có stock_qty nên bỏ qua.
    }

    /* ------------------- helpers -------------------- */

    private String normalize(String q) {
        if (!StringUtils.hasText(q)) return null;
        return q.trim();
    }

    private void ensureSupplierExists(Integer id) {
        if (id == null) throw new IllegalArgumentException("supplierId required");
        if (!supplierRepo.existsById(id)) {
            throw new NoSuchElementException("Supplier not found");
        }
    }

    private void validateItems(java.util.List<com.banhoa.backend.purchase.dto.PurchaseOrderItemDTO> items) {
        if (items == null || items.isEmpty()) throw new IllegalArgumentException("Danh sách hàng hóa rỗng");
        for (com.banhoa.backend.purchase.dto.PurchaseOrderItemDTO it : items) {
            if (it.getQty() == null || it.getQty() <= 0) throw new IllegalArgumentException("Số lượng phải > 0");
            if (it.getUnitCost() == null || it.getUnitCost().compareTo(BigDecimal.ZERO) < 0) throw new IllegalArgumentException("Đơn giá không hợp lệ");
            if (it.getProductId() == null || !productRepo.existsById(it.getProductId())) {
                throw new NoSuchElementException("Sản phẩm không tồn tại: " + it.getProductId());
            }
        }
    }

    private void upsertItemsAndTotals(PurchaseOrder po, java.util.List<com.banhoa.backend.purchase.dto.PurchaseOrderItemDTO> items, java.math.BigDecimal discount) {
        BigDecimal sub = BigDecimal.ZERO;
        for (com.banhoa.backend.purchase.dto.PurchaseOrderItemDTO dto : items) {
            PurchaseOrderItem line = new PurchaseOrderItem();
            line.setPurchaseOrderId(po.getId());
            line.setProductId(dto.getProductId());
            line.setQty(dto.getQty());
            line.setUnitCost(dto.getUnitCost());
            BigDecimal lineSub = dto.getUnitCost().multiply(new BigDecimal(dto.getQty()));
            line.setSubtotal(lineSub);
            itemRepo.save(line);
            sub = sub.add(lineSub);
        }
        po.setSubtotal(sub);
        po.setDiscount(discount != null ? discount : BigDecimal.ZERO);
        po.setTotal(sub.subtract(po.getDiscount()));
        repo.save(po);
    }

    private String generateCode() {
        // PO-YYYYMMDD-XXXX
        String date = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE);
        int seq = 1;
        String code;
        do {
            code = "PO-" + date + "-" + String.format("%04d", seq++);
        } while (repo.existsByCode(code));
        return code;
    }
}
