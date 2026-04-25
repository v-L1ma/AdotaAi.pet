package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

public class PerguntaRespostaDTO {

    private UUID perguntaId;
    private String perguntaTexto;
    private String respostaTexto;

    public PerguntaRespostaDTO(UUID perguntaId, String perguntaTexto, String respostaTexto) {
        this.perguntaId = perguntaId;
        this.perguntaTexto = perguntaTexto;
        this.respostaTexto = respostaTexto;
    }

    public UUID getPerguntaId() {
        return perguntaId;
    }

    public String getPerguntaTexto() {
        return perguntaTexto;
    }

    public String getRespostaTexto() {
        return respostaTexto;
    }
}
