package com.adotaai.adotaai.Application.DTO;

import com.adotaai.adotaai.Domain.Entity.FormularioEntity;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

public class FormularioTemplateDTO {

    private UUID id;
    private UUID usuarioCriadorId;
    private List<PerguntaDTO> perguntas;

    public FormularioTemplateDTO(FormularioEntity entity) {
        this.id = entity.getId();
        this.usuarioCriadorId = entity.getUsuarioCriador().getId();
        this.perguntas = entity.getPerguntas().stream()
                .map(pergunta -> new PerguntaDTO(pergunta.getId(), pergunta.getTexto()))
                .collect(Collectors.toList());
    }

    public UUID getId() {
        return id;
    }

    public UUID getUsuarioCriadorId() {
        return usuarioCriadorId;
    }

    public List<PerguntaDTO> getPerguntas() {
        return perguntas;
    }
}
