package com.adotaai.adotaai.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitacoes_adocao")
public class SolicitacaoAdocaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adotante_id", nullable = false)
    private UsuarioEntity adotante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anunciante_id", nullable = false)
    private UsuarioEntity anunciante;

    @JsonManagedReference("solicitacao-respostas")
    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RespostaEntity> respostas = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status;

    @Column(nullable = false)
    private LocalDateTime dataSolicitacao;

    public SolicitacaoAdocaoEntity() {
        this.status = StatusSolicitacao.PENDENTE;
        this.dataSolicitacao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UsuarioEntity getAdotante() {
        return adotante;
    }

    public void setAdotante(UsuarioEntity adotante) {
        this.adotante = adotante;
    }

    public UsuarioEntity getAnunciante() {
        return anunciante;
    }

    public void setAnunciante(UsuarioEntity anunciante) {
        this.anunciante = anunciante;
    }

    public List<RespostaEntity> getRespostas() {
        return respostas;
    }

    public void setRespostas(List<RespostaEntity> respostas) {
        this.respostas = respostas;
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public void setStatus(StatusSolicitacao status) {
        this.status = status;
    }

    public LocalDateTime getDataSolicitacao() {
        return dataSolicitacao;
    }

    public void setDataSolicitacao(LocalDateTime dataSolicitacao) {
        this.dataSolicitacao = dataSolicitacao;
    }
}
