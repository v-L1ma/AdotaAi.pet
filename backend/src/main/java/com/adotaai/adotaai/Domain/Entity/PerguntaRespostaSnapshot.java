package com.adotaai.adotaai.Domain.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.util.UUID;

@Embeddable
public class PerguntaRespostaSnapshot {

    @Column(name = "pergunta_id")
    private UUID perguntaId;

    @Column(name = "pergunta_texto", length = 200)
    private String perguntaTexto;

    @Column(name = "resposta_texto", length = 500)
    private String respostaTexto;

    public PerguntaRespostaSnapshot() {
    }

    public PerguntaRespostaSnapshot(UUID perguntaId, String perguntaTexto, String respostaTexto) {
        this.perguntaId = perguntaId;
        this.perguntaTexto = perguntaTexto;
        this.respostaTexto = respostaTexto;
    }

    public UUID getPerguntaId() {
        return perguntaId;
    }

    public void setPerguntaId(UUID perguntaId) {
        this.perguntaId = perguntaId;
    }

    public String getPerguntaTexto() {
        return perguntaTexto;
    }

    public void setPerguntaTexto(String perguntaTexto) {
        this.perguntaTexto = perguntaTexto;
    }

    public String getRespostaTexto() {
        return respostaTexto;
    }

    public void setRespostaTexto(String respostaTexto) {
        this.respostaTexto = respostaTexto;
    }
}