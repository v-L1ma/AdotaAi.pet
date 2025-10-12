package com.adotaai.adotaai.DTO;

import com.adotaai.adotaai.Entity.RespostaEntity;

public class RespostaResponseDTO {

    private Long id;
    private Long solicitacaoId;
    private Long perguntaId;
    private String resposta;

    public RespostaResponseDTO(RespostaEntity entity) {
        this.id = entity.getId();
        this.solicitacaoId = entity.getSolicitacao().getId();
        this.perguntaId = entity.getPergunta().getId();
        this.resposta = entity.getResposta();
    }

    public Long getId() { return id; }
    public Long getSolicitacaoId() { return solicitacaoId; }
    public Long getPerguntaId() { return perguntaId; }
    public String getResposta() { return resposta; }
}