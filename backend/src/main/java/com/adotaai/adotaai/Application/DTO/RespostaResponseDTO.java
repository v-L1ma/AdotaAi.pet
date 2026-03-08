package com.adotaai.adotaai.Application.DTO;

import com.adotaai.adotaai.Domain.Entity.RespostaEntity;
import java.util.UUID;

public class RespostaResponseDTO {

    private UUID id;
    private UUID solicitacaoId;
    private UUID perguntaId;
    private String resposta;

    public RespostaResponseDTO(RespostaEntity entity) {
        this.id = entity.getId();
        this.solicitacaoId = entity.getSolicitacao().getId();
        this.perguntaId = entity.getPergunta().getId();
        this.resposta = entity.getResposta();
    }

    public UUID getId() {
        return id;
    }

    public UUID getSolicitacaoId() {
        return solicitacaoId;
    }

    public UUID getPerguntaId() {
        return perguntaId;
    }

    public String getResposta() {
        return resposta;
    }
}
