package com.banhoa.backend.product.repository;

import com.banhoa.backend.product.entity.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttributeRepository extends JpaRepository<Attribute, Integer> {
}
