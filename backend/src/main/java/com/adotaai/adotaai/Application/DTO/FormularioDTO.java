package com.adotaai.adotaai.Application.DTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class FormularioDTO {

    @NotNull(message = "O ID do usuário criador é obrigatório.")
    private UUID usuarioCriadorId;

    @NotNull(message = "O ID do usuário respondente é obrigatório.")
    private UUID usuarioRespondenteId;

    @NotEmpty(message = "A lista de perguntas não pode estar vazia.")
    private List<@NotNull(message = "A pergunta não pode ser nula.") String> perguntas;

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