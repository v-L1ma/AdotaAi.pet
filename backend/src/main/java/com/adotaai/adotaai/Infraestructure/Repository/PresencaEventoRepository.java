package com.adotaai.adotaai.Infraestructure.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adotaai.adotaai.Domain.Entity.PresencaEventoEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PresencaEventoRepository extends JpaRepository<PresencaEventoEntity, UUID> {

    Optional<PresencaEventoEntity> findByEventoIdAndUsuarioId(UUID eventoId, UUID usuarioId);

    boolean existsByEventoIdAndUsuarioId(UUID eventoId, UUID usuarioId);

    long countByEventoId(UUID eventoId);

    List<PresencaEventoEntity> findByUsuarioId(UUID usuarioId);
}