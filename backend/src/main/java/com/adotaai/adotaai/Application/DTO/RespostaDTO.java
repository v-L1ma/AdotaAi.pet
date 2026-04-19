package com.adotaai.adotaai.Application.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class RespostaDTO {

    @NotNull(message = "O ID da solicitação é obrigatório.")
    private UUID solicitacaoId;

    @NotNull(message = "O ID da pergunta é obrigatório.")
    private UUID perguntaId;

    @NotBlank(message = "A resposta não pode estar em branco.")
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