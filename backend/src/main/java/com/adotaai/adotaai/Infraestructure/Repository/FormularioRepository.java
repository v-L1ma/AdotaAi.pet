package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.FormularioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FormularioRepository extends JpaRepository<FormularioEntity, UUID> {

    @Query("SELECT f FROM FormularioEntity f WHERE f.id = :id AND f.fl_ativo = true")
    Optional<FormularioEntity> findByIdAndFl_ativoTrue(UUID id);

    @Query("SELECT f FROM FormularioEntity f WHERE f.fl_ativo = true AND f.usuarioCriador.id = :usuarioCriadorId")
    List<FormularioEntity> findAllByFl_ativoTrueAndUsuarioCriadorId(UUID usuarioCriadorId);

    Optional<FormularioEntity> findByUsuarioCriadorId(UUID usuarioCriadorId);

    List<FormularioEntity> findAllByUsuarioCriadorId(UUID usuarioCriadorId);
}
