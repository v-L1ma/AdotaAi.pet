package com.adotaai.adotaai.Application.DTO;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class SolicitacaoAdocaoDTO {

    @NotNull(message = "O ID do pet é obrigatório.")
    private UUID petId;

    private UUID formularioId;

    public UUID getPetId() {
        return petId;
    }

    public void setPetId(UUID petId) {
        this.petId = petId;
    }

    public UUID getFormularioId() {
        return formularioId;
    }

    public void setFormularioId(UUID formularioId) {
        this.formularioId = formularioId;
    }
}