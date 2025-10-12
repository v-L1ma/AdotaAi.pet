package com.adotaai.adotaai.Repository;

import com.adotaai.adotaai.Entity.SolicitacaoAdocaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitacaoAdocaoRepository extends JpaRepository<SolicitacaoAdocaoEntity, Long> {
    
}