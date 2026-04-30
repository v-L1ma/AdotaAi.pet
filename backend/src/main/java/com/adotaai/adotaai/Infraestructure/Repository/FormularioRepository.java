package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.FormularioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FormularioRepository extends JpaRepository<FormularioEntity, UUID> {

    Optional<FormularioEntity> findByUsuarioCriadorId(UUID usuarioCriadorId);

    List<FormularioEntity> findAllByUsuarioCriadorId(UUID usuarioCriadorId);
}
