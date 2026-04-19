package com.adotaai.adotaai.Application.DTO;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class SolicitacaoAdocaoDTO {

    @NotNull(message = "O ID do adotante é obrigatório.")
    private UUID adotanteId;

    @NotNull(message = "O ID do formulário é obrigatório.")
    private UUID formularioId;

    public UUID getAdotanteId() {
        return adotanteId;
    }

    public void setAdotanteId(UUID adotanteId) {
        this.adotanteId = adotanteId;
    }

    public UUID getFormularioId() {
        return formularioId;
    }

    public void setFormularioId(UUID formularioId) {
        this.formularioId = formularioId;
    }
}