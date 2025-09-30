package com.banhoa.backend.permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;

    public Page<Permission> search(String q, Pageable pageable) {
        return permissionRepository.search(q, pageable);
    }
}
