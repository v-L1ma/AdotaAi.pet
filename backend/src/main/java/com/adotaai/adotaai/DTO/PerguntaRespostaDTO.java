package com.adotaai.adotaai.DTO;

import java.util.List;

public class PerguntaRespostaDTO {
    private Long perguntaId;
    private String perguntaTexto;
    private String respostaTexto;

    public PerguntaRespostaDTO(Long perguntaId, String perguntaTexto, String respostaTexto) {
        this.perguntaId = perguntaId;
        this.perguntaTexto = perguntaTexto;
        this.respostaTexto = respostaTexto;
    }

    public Long getPerguntaId() { return perguntaId; }
    public String getPerguntaTexto() { return perguntaTexto; }
    public String getRespostaTexto() { return respostaTexto; }
}
