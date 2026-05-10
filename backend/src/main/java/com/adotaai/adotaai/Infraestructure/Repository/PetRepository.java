package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, UUID> {

    @Query("SELECT p FROM PetEntity p WHERE p.fl_ativo = true")
    List<PetEntity> findAllByFl_ativoTrue();

    @Query("SELECT p FROM PetEntity p WHERE p.fl_ativo = true AND p.status = 'APROVADO'")
    List<PetEntity> findAllVisible();

    @Query("SELECT p FROM PetEntity p WHERE p.fl_ativo = true AND p.user.id = :userId")
    List<PetEntity> findAllByFl_ativoTrueAndUserId(@Param("userId") UUID userId);

    @Query("SELECT p FROM PetEntity p WHERE p.id = :id AND p.fl_ativo = true")
    Optional<PetEntity> findByIdAndFl_ativoTrue(@Param("id") UUID id);

    Optional<PetEntity> findByFormularioId(UUID formularioId);

    List<PetEntity> findAllByUserId(UUID userId);

    @Modifying
    @Query("UPDATE PetEntity p SET p.fl_ativo = false, p.last_modified_at = CURRENT_TIMESTAMP WHERE p.user.id = :userId")
    void deactivateByUserId(@Param("userId") UUID userId);

    void deleteByUserId(UUID userId);

    @Query("SELECT p FROM PetEntity p WHERE p.fl_ativo = true")
    List<PetEntity> findAll();

    @Query("SELECT p FROM PetEntity p WHERE p.id = :id")
    Optional<PetEntity> findById(@Param("id") UUID id);

}
