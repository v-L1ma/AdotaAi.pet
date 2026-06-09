package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.SolicitacaoAdocaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SolicitacaoAdocaoRepository extends JpaRepository<SolicitacaoAdocaoEntity, UUID> {

    @Query("SELECT s FROM SolicitacaoAdocaoEntity s WHERE s.id = :id AND s.fl_ativo = true")
    Optional<SolicitacaoAdocaoEntity> findByIdAndFl_ativoTrue(UUID id);

    Optional<SolicitacaoAdocaoEntity> findByAdotanteIdAndPetId(UUID adotanteId, UUID petId);

    boolean existsByAdotanteIdAndPetId(UUID adotanteId, UUID petId);

    List<SolicitacaoAdocaoEntity> findAllByAdotanteId(UUID adotanteId);

    List<SolicitacaoAdocaoEntity> findAllByAnuncianteId(UUID anuncianteId);

}
