package com.adotaai.adotaai.Repository;

import com.adotaai.adotaai.Entity.FormularioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FormularioRepository extends JpaRepository<FormularioEntity, Long> {
    Optional<FormularioEntity> findByUsuarioCriadorId(Long usuarioCriadorId);
}