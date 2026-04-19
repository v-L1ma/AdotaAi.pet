package com.adotaai.adotaai.Application.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class PerguntaDTO {

    private UUID id;

    @NotBlank(message = "O texto da pergunta é obrigatório.")
    @Size(max = 30, message = "O texto da pergunta não pode exceder 30 caracteres.")
    private String texto;

    public PerguntaDTO() {
    }

    public PerguntaDTO(UUID id, String texto) {
        this.id = id;
        this.texto = texto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }
}