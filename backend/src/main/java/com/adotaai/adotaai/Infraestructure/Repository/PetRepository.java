package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, UUID> {

    List<PetEntity> findAllByUserId(UUID userId);

    Optional<PetEntity> findByFormularioId(UUID formularioId);

    void deleteByUserId(UUID userId);

}
