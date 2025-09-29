package com.banhoa.backend.category.service;

import com.banhoa.backend.category.dto.CategoryRequest;
import com.banhoa.backend.category.dto.CategoryResponse;
import com.banhoa.backend.category.entity.Category;
import com.banhoa.backend.category.mapper.CategoryMapper;
import com.banhoa.backend.category.repository.CategoryRepository;
import com.banhoa.backend.product.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository repo;
    private final ProductRepository productRepo;

    public CategoryService(CategoryRepository repo, ProductRepository productRepo) {
        this.repo = repo;
        this.productRepo = productRepo;
    }

    public Page<CategoryResponse> search(String q, Boolean active, Integer parentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("sortOrder"), Sort.Order.asc("name")));
        Page<Category> categories = repo.search(normalizeQ(q), active, parentId, pageable);
        return categories.map(CategoryMapper::toResponse);
    }

    public List<CategoryResponse> getTree(boolean activeOnly) {
        List<Category> list = activeOnly ? repo.findAllByIsActiveTrueOrderBySortOrderAscNameAsc()
                                         : repo.findAllByOrderBySortOrderAscNameAsc();
        Map<Integer, CategoryResponse> map = new LinkedHashMap<>();
        List<CategoryResponse> roots = new ArrayList<>();

        for (Category c : list) {
            CategoryResponse node = CategoryMapper.toResponse(c);
            map.put(c.getId(), node);
        }

        for (Category c : list) {
            CategoryResponse node = map.get(c.getId());
            if (c.getParentId() == null) {
                roots.add(node);
            } else {
                CategoryResponse parent = map.get(c.getParentId());
                if (parent != null) {
                    parent.getChildren().add(node);
                } else {
                    // parent không tồn tại (dữ liệu lỗi), coi như root
                    roots.add(node);
                }
            }
        }
        return roots;
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        if (!StringUtils.hasText(req.getSlug())) {
            req.setSlug(slugify(req.getName()));
        }
        ensureUniqueSlug(req.getSlug(), null);

        Category c = new Category();
        CategoryMapper.copy(req, c);
        c.setSlug(makeUniqueSlug(c.getSlug(), null));
        c = repo.save(c);
        return CategoryMapper.toResponse(c);
    }

    @Transactional
    public CategoryResponse update(Integer id, CategoryRequest req) {
        Category c = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Category not found"));

        String newSlug = StringUtils.hasText(req.getSlug()) ? req.getSlug() : slugify(req.getName());
        if (!newSlug.equalsIgnoreCase(c.getSlug())) {
            ensureUniqueSlug(newSlug, id);
            c.setSlug(makeUniqueSlug(newSlug, id));
        }

        // name/parent/active/sortOrder
        c.setName(req.getName());
        c.setParentId(req.getParentId());
        c.setIsActive(req.getIsActive() != null ? req.getIsActive() : Boolean.TRUE);
        c.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);

        c = repo.save(c);
        return CategoryMapper.toResponse(c);
    }

    @Transactional
    public void setActive(Integer id, boolean active) {
        Category c = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Category not found"));
        c.setIsActive(active);
        repo.save(c);
    }

    @Transactional
    public void delete(Integer id) {
        // Không xóa nếu có danh mục con
        long childCount = repo.countByParentId(id);
        if (childCount > 0) {
            throw new IllegalStateException("Không thể xóa: còn " + childCount + " danh mục con");
        }
        // Không xóa nếu vẫn còn sản phẩm tham chiếu (tùy chọn). DB đã ON DELETE SET NULL,
        // nhưng ta có thể cảnh báo trước để tránh mất phân loại.
        long prodCount = countProductsByCategory(id);
        if (prodCount > 0) {
            // vẫn cho phép xóa nếu bạn muốn thì comment 2 dòng dưới
            throw new IllegalStateException("Không thể xóa: còn " + prodCount + " sản phẩm thuộc danh mục này");
            // Hoặc: tiếp tục xóa -> sản phẩm sẽ được set NULL do FK ON DELETE SET NULL
            // repo.deleteById(id); return;
        }
        repo.deleteById(id);
    }

    private long countProductsByCategory(Integer id) {
        try {
            // Product entity có trường categoryId -> Spring Data sẽ sinh query theo tên field
            return productRepo.countByCategoryId(id);
        } catch (Exception e) {
            // nếu không có method trên repo thì coi như 0 để không chặn
            return 0L;
        }
    }

    /* ------------------- helpers -------------------- */

    private String normalizeQ(String q) {
        if (!StringUtils.hasText(q)) return null;
        return q.trim();
    }

    private void ensureUniqueSlug(String slug, Integer exceptId) {
    boolean exists = repo.existsBySlug(slug);
    if (exists) {
        if (exceptId == null) throw new IllegalArgumentException("Slug đã tồn tại");
        for (Category c : repo.findAll()) {
            if (c.getSlug().equalsIgnoreCase(slug) && !c.getId().equals(exceptId)) {
                throw new IllegalArgumentException("Slug đã tồn tại");
            }
        }
    }
}


    private String makeUniqueSlug(String base, Integer exceptId) {
    String s = base;
    int i = 1;
    while (true) {
        boolean exists = repo.existsBySlug(s);
        if (!exists) return s;

        if (exceptId != null) {
            Category matched = null;
            for (Category c : repo.findAll()) {
                if (c.getSlug().equalsIgnoreCase(s) && !c.getId().equals(exceptId)) {
                    matched = c;
                    break;
                }
            }
            if (matched == null) return s;
        }
        i++;
        s = base + "-" + i;
    }
}


    private String slugify(String input) {
    if (!StringUtils.hasText(input)) return null;
    String nowhite = input.trim().toLowerCase();
    String normalized = Normalizer.normalize(nowhite, Normalizer.Form.NFD)
            .replaceAll("\\\\p{InCombiningDiacriticalMarks}+", ""); // LƯU Ý: 2 backslash trong code Java là "\\"
    normalized = normalized.replaceAll("[^a-z0-9\\s-]", "");
    normalized = normalized.replaceAll("\\s+", "-");
    normalized = normalized.replaceAll("-{2,}", "-");
    return normalized.replaceAll("^-|-$", "");
}

}
