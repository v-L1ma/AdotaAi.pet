package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.SolicitacaoAdocaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SolicitacaoAdocaoRepository extends JpaRepository<SolicitacaoAdocaoEntity, UUID> {

    Optional<SolicitacaoAdocaoEntity> findByAdotanteIdAndFormularioId(UUID adotanteId, UUID formularioId);

    List<SolicitacaoAdocaoEntity> findAllByAdotanteId(UUID adotanteId);

    List<SolicitacaoAdocaoEntity> findAllByAnuncianteId(UUID anuncianteId);

}
