package com.adotaai.adotaai.Application.DTO;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class SolicitacaoAdocaoDTO {

    @NotNull(message = "O ID do formulário é obrigatório.")
    private UUID formularioId;

    public UUID getFormularioId() {
        return formularioId;
    }

    public void setFormularioId(UUID formularioId) {
        this.formularioId = formularioId;
    }
}