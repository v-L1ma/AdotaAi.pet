package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.EventoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventoRepository extends JpaRepository<EventoEntity, UUID> {

    @Query("SELECT e FROM EventoEntity e WHERE e.fl_ativo = true and e.status = 'APROVADO' ORDER BY e.created_at DESC")
    List<EventoEntity> findAllVisible();

    @Query("SELECT e FROM EventoEntity e WHERE e.id = :id AND e.fl_ativo = true")
    Optional<EventoEntity> findByIdAndFl_ativoTrue(UUID id);

    @Query("SELECT e FROM EventoEntity e WHERE e.fl_ativo = true AND e.user.id = :userId")
    List<EventoEntity> findAllByFl_ativoTrueAndUserId(UUID userId);

    List<EventoEntity> findAllByUserId(UUID userId);

    @Query("SELECT e FROM EventoEntity e WHERE e.fl_ativo = true")
    List<EventoEntity> findAll();

}
