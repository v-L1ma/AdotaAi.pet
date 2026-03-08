package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

public class SolicitacaoAdocaoDTO {

    private UUID adotanteId;

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
