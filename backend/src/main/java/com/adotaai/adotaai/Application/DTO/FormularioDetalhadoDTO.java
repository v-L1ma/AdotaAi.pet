package com.adotaai.adotaai.Application.DTO;

import java.util.List;
import java.util.UUID;

public class FormularioDetalhadoDTO {

    private UUID solicitacaoId;
    private UUID usuarioCriadorId;
    private String usuarioCriadorNome;
    private UUID usuarioRespondenteId;
    private String usuarioRespondenteNome;
    private String linkFotoPerfil;
    private List<PerguntaRespostaDTO> perguntasRespostas;

    public FormularioDetalhadoDTO(UUID solicitacaoId, UUID usuarioCriadorId, String usuarioCriadorNome,
            UUID usuarioRespondenteId, String usuarioRespondenteNome, String linkFotoPerfil,
        List<PerguntaRespostaDTO> perguntasRespostas) {
        this.solicitacaoId = solicitacaoId;
        this.usuarioCriadorId = usuarioCriadorId;
        this.usuarioCriadorNome = usuarioCriadorNome;
        this.usuarioRespondenteId = usuarioRespondenteId;
        this.usuarioRespondenteNome = usuarioRespondenteNome;
        this.linkFotoPerfil = linkFotoPerfil;
        this.perguntasRespostas = perguntasRespostas;
    }

    public UUID getSolicitacaoId() {
        return solicitacaoId;
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

    public String getLinkFotoPerfil() {
        return linkFotoPerfil;
    }

    public List<PerguntaRespostaDTO> getPerguntasRespostas() {
        return perguntasRespostas;
    }
}
