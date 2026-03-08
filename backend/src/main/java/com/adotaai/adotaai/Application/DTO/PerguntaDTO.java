package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

public class PerguntaDTO {

    private UUID id;
    private String texto;

    public PerguntaDTO(UUID id, String texto) {
        this.id = id;
        this.texto = texto;
    }

    public UUID getId() {
        return id;
    }

    public String getTexto() {
        return texto;
    }
}
