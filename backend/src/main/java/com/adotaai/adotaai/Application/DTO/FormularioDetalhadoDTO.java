package com.adotaai.adotaai.Application.DTO;

import java.util.List;
import java.util.UUID;

public class FormularioDetalhadoDTO {

    private UUID formularioId;
    private UUID usuarioCriadorId;
    private String usuarioCriadorNome;
    private UUID usuarioRespondenteId;
    private String usuarioRespondenteNome;
    private List<PerguntaRespostaDTO> perguntasRespostas;

    public FormularioDetalhadoDTO(UUID formularioId, UUID usuarioCriadorId, String usuarioCriadorNome,
            UUID usuarioRespondenteId, String usuarioRespondenteNome,
            List<PerguntaRespostaDTO> perguntasRespostas) {
        this.formularioId = formularioId;
        this.usuarioCriadorId = usuarioCriadorId;
        this.usuarioCriadorNome = usuarioCriadorNome;
        this.usuarioRespondenteId = usuarioRespondenteId;
        this.usuarioRespondenteNome = usuarioRespondenteNome;
        this.perguntasRespostas = perguntasRespostas;
    }

    public UUID getFormularioId() {
        return formularioId;
    }

    public UUID getUsuarioCriadorId() {
        return usuarioCriadorId;
    }

    public String getUsuarioCriadorNome() {
        return usuarioCriadorNome;
    }

    public UUID getUsuarioRespondenteId() {
        return usuarioRespondenteId;
    }

    public String getUsuarioRespondenteNome() {
        return usuarioRespondenteNome;
    }

    public List<PerguntaRespostaDTO> getPerguntasRespostas() {
        return perguntasRespostas;
    }
}
