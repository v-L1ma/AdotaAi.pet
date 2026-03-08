package com.adotaai.adotaai.Application.DTO;

import java.util.List;
import java.util.UUID;

public class FormularioDTO {

    private UUID usuarioCriadorId;
    private UUID usuarioRespondenteId;
    private List<String> perguntas;

    public UUID getUsuarioCriadorId() {
        return usuarioCriadorId;
    }

    public void setUsuarioCriadorId(UUID usuarioCriadorId) {
        this.usuarioCriadorId = usuarioCriadorId;
    }

    public UUID getUsuarioRespondenteId() {
        return usuarioRespondenteId;
    }

    public void setUsuarioRespondenteId(UUID usuarioRespondenteId) {
        this.usuarioRespondenteId = usuarioRespondenteId;
    }

    public List<String> getPerguntas() {
        return perguntas;
    }

    public void setPerguntas(List<String> perguntas) {
        this.perguntas = perguntas;
    }
}
