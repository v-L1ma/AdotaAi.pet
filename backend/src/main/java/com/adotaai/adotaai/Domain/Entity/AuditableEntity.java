package com.adotaai.adotaai.Domain.Entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

@MappedSuperclass
@EntityListeners(AuditableEntityListener.class)
public abstract class AuditableEntity {

    @Column(name = "last_modified_by")
    private UUID last_modified_by;

    @Column(name = "last_modified_at")
    private LocalDateTime last_modified_at;

    @Column(name = "created_by")
    private UUID created_by;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "fl_ativo")
    private Boolean fl_ativo;

    @PrePersist
    public void prePersist() {
        if (this.fl_ativo == null) {
            this.fl_ativo = true;
        }
        if (this.created_at == null) {
            this.created_at = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.last_modified_at = LocalDateTime.now();
    }

    public void ativar() {
        this.fl_ativo = true;
        this.last_modified_at = LocalDateTime.now();
    }

    public void inativar() {
        this.fl_ativo = false;
        this.last_modified_at = LocalDateTime.now();
    }

    @JsonIgnore
    public UUID getLast_modified_by() {
        return last_modified_by;
    }

    public void setLast_modified_by(UUID last_modified_by) {
        this.last_modified_by = last_modified_by;
    }

    @JsonIgnore
    public LocalDateTime getLast_modified_at() {
        return last_modified_at;
    }

    public void setLast_modified_at(LocalDateTime last_modified_at) {
        this.last_modified_at = last_modified_at;
    }

    @JsonIgnore
    public UUID getCreated_by() {
        return created_by;
    }

    public void setCreated_by(UUID created_by) {
        this.created_by = created_by;
    }

    @JsonIgnore
    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    @JsonIgnore
    public Boolean getFl_ativo() {
        return fl_ativo;
    }

    public void setFl_ativo(Boolean fl_ativo) {
        this.fl_ativo = fl_ativo;
    }
}
