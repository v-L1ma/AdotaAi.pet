package com.adotaai.adotaai.Domain.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.adotaai.adotaai.Domain.Enum.StatusSolicitacao;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "solicitacoes_adocao")
public class SolicitacaoAdocaoEntity extends AuditableEntity {

    @Id
    @GeneratedValue()
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adotante_id", nullable = false)
    private UsuarioEntity adotante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anunciante_id", nullable = false)
    private UsuarioEntity anunciante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formulario_id", nullable = false)
    private FormularioEntity formulario;

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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
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

    public FormularioEntity getFormulario() {
        return formulario;
    }

    public void setFormulario(FormularioEntity formulario) {
        this.formulario = formulario;
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
