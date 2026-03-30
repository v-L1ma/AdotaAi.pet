package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.FavoritoPetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoritoPetRepository extends JpaRepository<FavoritoPetEntity, UUID> {

    boolean existsByUsuarioIdAndPetId(UUID usuarioId, UUID petId);

    Optional<FavoritoPetEntity> findByUsuarioIdAndPetId(UUID usuarioId, UUID petId);

    List<FavoritoPetEntity> findAllByUsuarioId(UUID usuarioId);
}
