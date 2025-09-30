package com.banhoa.backend.role;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public Page<Role> search(String q, Pageable pageable) {
        return roleRepository.search(q, pageable);
    }
}
