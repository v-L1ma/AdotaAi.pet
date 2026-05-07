package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.EspecieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EspecieRepository extends JpaRepository<EspecieEntity, UUID> {
    boolean existsByNome(String nome);

    Optional<EspecieEntity> findByNomeIgnoreCase(String nome);
}