package com.adotaai.adotaai.DTO;

import java.util.List;

public class FormularioDetalhadoDTO {

    private Long formularioId;
    private Long usuarioCriadorId;
    private String usuarioCriadorNome;
    private Long usuarioRespondenteId;
    private String usuarioRespondenteNome;
    private List<PerguntaRespostaDTO> perguntasRespostas;

    public FormularioDetalhadoDTO(Long formularioId, Long usuarioCriadorId, String usuarioCriadorNome,
                                  Long usuarioRespondenteId, String usuarioRespondenteNome,
                                  List<PerguntaRespostaDTO> perguntasRespostas) {
        this.formularioId = formularioId;
        this.usuarioCriadorId = usuarioCriadorId;
        this.usuarioCriadorNome = usuarioCriadorNome;
        this.usuarioRespondenteId = usuarioRespondenteId;
        this.usuarioRespondenteNome = usuarioRespondenteNome;
        this.perguntasRespostas = perguntasRespostas;
    }

    public Long getFormularioId() {
        return formularioId;
    }

    public Long getUsuarioCriadorId() {
        return usuarioCriadorId;
    }

    public String getUsuarioCriadorNome() {
        return usuarioCriadorNome;
    }

    public Long getUsuarioRespondenteId() {
        return usuarioRespondenteId;
    }

    public String getUsuarioRespondenteNome() {
        return usuarioRespondenteNome;
    }

    public List<PerguntaRespostaDTO> getPerguntasRespostas() {
        return perguntasRespostas;
    }
}