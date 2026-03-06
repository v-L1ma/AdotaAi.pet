package com.adotaai.adotaai.Repository;

import com.adotaai.adotaai.Entity.SolicitacaoAdocaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SolicitacaoAdocaoRepository extends JpaRepository<SolicitacaoAdocaoEntity, Long> {

    Optional<SolicitacaoAdocaoEntity> findByAdotanteIdAndFormularioId(Long adotanteId, Long formularioId);

}

