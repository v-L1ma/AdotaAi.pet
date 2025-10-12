package com.adotaai.adotaai.DTO;

import com.adotaai.adotaai.Entity.SolicitacaoAdocaoEntity;
import com.adotaai.adotaai.Entity.StatusSolicitacao;

import java.time.LocalDateTime;

public class SolicitacaoResponseDTO {

    private Long id;
    private Long adotanteId;
    private Long anuncianteId;
    private StatusSolicitacao status;
    private LocalDateTime dataSolicitacao;

    public SolicitacaoResponseDTO(SolicitacaoAdocaoEntity entity) {
        this.id = entity.getId();
        this.adotanteId = entity.getAdotante().getId();
        this.anuncianteId = entity.getAnunciante().getId();
        this.status = entity.getStatus();
        this.dataSolicitacao = entity.getDataSolicitacao();
    }


    public Long getId() { return id; }
    public Long getAdotanteId() { return adotanteId; }
    public Long getAnuncianteId() { return anuncianteId; }
    public StatusSolicitacao getStatus() { return status; }
    public LocalDateTime getDataSolicitacao() { return dataSolicitacao; }
}