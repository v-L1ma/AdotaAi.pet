package com.adotaai.adotaai.Application.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

import com.adotaai.adotaai.Domain.Entity.SolicitacaoAdocaoEntity;
import com.adotaai.adotaai.Domain.Enum.StatusSolicitacao;

public class SolicitacaoResponseDTO {

    private UUID id;
    private UUID adotanteId;
    private UUID anuncianteId;
    private StatusSolicitacao status;
    private LocalDateTime dataSolicitacao;

    public SolicitacaoResponseDTO(SolicitacaoAdocaoEntity entity) {
        this.id = entity.getId();
        this.adotanteId = entity.getAdotante().getId();
        this.anuncianteId = entity.getAnunciante().getId();
        this.status = entity.getStatus();
        this.dataSolicitacao = entity.getDataSolicitacao();
    }

    public UUID getId() {
        return id;
    }

    public UUID getAdotanteId() {
        return adotanteId;
    }

    public UUID getAnuncianteId() {
        return anuncianteId;
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public LocalDateTime getDataSolicitacao() {
        return dataSolicitacao;
    }
}
