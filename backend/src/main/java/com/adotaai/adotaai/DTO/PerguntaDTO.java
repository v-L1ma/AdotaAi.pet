package com.adotaai.adotaai.DTO;

public class PerguntaDTO {
    private Long id;
    private String texto;

    public PerguntaDTO(Long id, String texto) {
        this.id = id;
        this.texto = texto;
    }

    public Long getId() { return id; }
    public String getTexto() { return texto; }
}