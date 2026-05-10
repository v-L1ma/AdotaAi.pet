package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.EspecieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EspecieRepository extends JpaRepository<EspecieEntity, UUID> {
    boolean existsByNome(String nome);

    @Query("SELECT e FROM EspecieEntity e WHERE e.fl_ativo = true")
    List<EspecieEntity> findAllByFl_ativoTrue();

    Optional<EspecieEntity> findByNomeIgnoreCase(String nome);
}