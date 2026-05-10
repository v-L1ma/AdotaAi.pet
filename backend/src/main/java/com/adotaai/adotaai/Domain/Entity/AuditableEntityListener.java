package com.adotaai.adotaai.Domain.Entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

public class AuditableEntityListener {

    @PrePersist
    public void setCreatedFields(Object entity) {
        if (entity instanceof AuditableEntity auditable) {
            if (auditable.getCreated_at() == null) {
                auditable.setCreated_at(LocalDateTime.now());
            }
            if (auditable.getFl_ativo() == null) {
                auditable.setFl_ativo(true);
            }
        }
    }

    @PreUpdate
    public void setModifiedFields(Object entity) {
        if (entity instanceof AuditableEntity auditable) {
            auditable.setLast_modified_at(LocalDateTime.now());
        }
    }
}
