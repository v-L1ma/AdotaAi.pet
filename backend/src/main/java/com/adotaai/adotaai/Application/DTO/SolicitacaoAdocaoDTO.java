package com.adotaai.adotaai.Application.DTO;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class SolicitacaoAdocaoDTO {

    @NotNull(message = "O ID do pet é obrigatório.")
    private UUID petId;

    private List<PerguntaRespostaDTO> respostas;

    public UUID getPetId() {
        return petId;
    }

    public void setPetId(UUID petId) {
        this.petId = petId;
    }

    public List<PerguntaRespostaDTO> getRespostas() {
        return respostas;
    }

    public void setRespostas(List<PerguntaRespostaDTO> respostas) {
        this.respostas = respostas;
    }
}