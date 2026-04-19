package com.adotaai.adotaai.Domain.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "respostas")
public class RespostaEntity extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String resposta;

    @JsonBackReference("solicitacao-respostas")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private SolicitacaoAdocaoEntity solicitacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pergunta_id", nullable = false)
    private PerguntaEntity pergunta;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getResposta() {
        return resposta;
    }

    public void setResposta(String resposta) {
        if (resposta == null || resposta.trim().isEmpty()) {
            throw new IllegalArgumentException("A resposta não pode estar vazia.");
        }
        this.resposta = resposta;
    }

    public SolicitacaoAdocaoEntity getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(SolicitacaoAdocaoEntity solicitacao) {
        this.solicitacao = solicitacao;
    }

    public PerguntaEntity getPergunta() {
        return pergunta;
    }

    public void setPergunta(PerguntaEntity pergunta) {
        this.pergunta = pergunta;
    }
}