package com.adotaai.adotaai.DTO;

import java.util.List;

public class FormularioDTO {
    private Long usuarioCriadorId;
    private Long usuarioRespondenteId;
    private List<String> perguntas;

    public Long getUsuarioCriadorId() { return usuarioCriadorId; }
    public void setUsuarioCriadorId(Long usuarioCriadorId) { this.usuarioCriadorId = usuarioCriadorId; }

    public Long getUsuarioRespondenteId() { return usuarioRespondenteId; }
    public void setUsuarioRespondenteId(Long usuarioRespondenteId) { this.usuarioRespondenteId = usuarioRespondenteId; }

    public List<String> getPerguntas() { return perguntas; }
    public void setPerguntas(List<String> perguntas) { this.perguntas = perguntas; }
}
