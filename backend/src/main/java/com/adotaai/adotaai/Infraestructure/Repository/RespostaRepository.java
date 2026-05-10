package com.adotaai.adotaai.Infraestructure.Repository;

import com.adotaai.adotaai.Domain.Entity.RespostaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RespostaRepository extends JpaRepository<RespostaEntity, UUID> {

    List<RespostaEntity> findBySolicitacaoId(UUID solicitacaoId);
}
