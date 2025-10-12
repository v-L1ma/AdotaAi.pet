package com.adotaai.adotaai.DTO;

import com.adotaai.adotaai.Entity.FormularioEntity;

import java.util.List;
import java.util.stream.Collectors;

public class FormularioTemplateDTO {
    private Long id;
    private Long usuarioCriadorId;
    private List<PerguntaDTO> perguntas;

    public FormularioTemplateDTO(FormularioEntity entity) {
        this.id = entity.getId();
        this.usuarioCriadorId = entity.getUsuarioCriador().getId();
        this.perguntas = entity.getPerguntas().stream()
                .map(pergunta -> new PerguntaDTO(pergunta.getId(), pergunta.getTexto()))
                .collect(Collectors.toList());
    }

    public Long getId() { return id; }
    public Long getUsuarioCriadorId() { return usuarioCriadorId; }
    public List<PerguntaDTO> getPerguntas() { return perguntas; }
}