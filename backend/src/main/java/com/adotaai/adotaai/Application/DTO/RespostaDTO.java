package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

public class RespostaDTO {

    private UUID solicitacaoId;
    private UUID perguntaId;
    private String resposta;

    public UUID getSolicitacaoId() {
        return solicitacaoId;
    }

    public void setSolicitacaoId(UUID solicitacaoId) {
        this.solicitacaoId = solicitacaoId;
    }

    public UUID getPerguntaId() {
        return perguntaId;
    }

    public void setPerguntaId(UUID perguntaId) {
        this.perguntaId = perguntaId;
    }

    public String getResposta() {
        return resposta;
    }

    public void setResposta(String resposta) {
        this.resposta = resposta;
    }
}
