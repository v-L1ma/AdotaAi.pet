package com.adotaai.adotaai.Repository;
import com.adotaai.adotaai.Entity.RespostaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RespostaRepository extends JpaRepository<RespostaEntity, Long> {
    List<RespostaEntity> findBySolicitacaoId(Long solicitacaoId);
}