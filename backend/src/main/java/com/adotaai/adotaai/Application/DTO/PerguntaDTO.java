package com.adotaai.adotaai.Application.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class PerguntaDTO {

    private UUID id;

    @NotBlank(message = "O texto da pergunta é obrigatório.")
    @Size(max = 30, message = "O texto da pergunta não pode exceder 30 caracteres.")
    private String texto;

    private Boolean fl_ativo = true;

    public PerguntaDTO() {
    }

    public PerguntaDTO(UUID id, String texto) {
        this.id = id;
        this.texto = texto;
    }

    public PerguntaDTO(UUID id, String texto, Boolean fl_ativo) {
        this.id = id;
        this.texto = texto;
        this.fl_ativo = fl_ativo;
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

    @JsonIgnore
    public Boolean getFl_ativo() {
        return fl_ativo;
    }

    public void setFl_ativo(Boolean fl_ativo) {
        this.fl_ativo = fl_ativo;
    }
}