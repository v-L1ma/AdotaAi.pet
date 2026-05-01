package com.adotaai.adotaai.Domain.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.adotaai.adotaai.Domain.Enum.StatusSolicitacao;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "solicitacoes_adocao")
public class SolicitacaoAdocaoEntity extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adotante_id", nullable = false)
    private UsuarioEntity adotante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anunciante_id", nullable = false)
    private UsuarioEntity anunciante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formulario_id", nullable = true)
    private FormularioEntity formulario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private PetEntity pet;

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
        if (adotante == null) {
            throw new IllegalArgumentException("O adotante não pode ser nulo.");
        }
        this.adotante = adotante;
    }

    public UsuarioEntity getAnunciante() {
        return anunciante;
    }

    public void setAnunciante(UsuarioEntity anunciante) {
        if (anunciante == null) {
            throw new IllegalArgumentException("O anunciante não pode ser nulo.");
        }
        this.anunciante = anunciante;
    }

    public FormularioEntity getFormulario() {
        return formulario;
    }

    public void setFormulario(FormularioEntity formulario) {
        this.formulario = formulario;
    }

    public PetEntity getPet() {
        return pet;
    }

    public void setPet(PetEntity pet) {
        if (pet == null) {
            throw new IllegalArgumentException("O pet não pode ser nulo.");
        }
        this.pet = pet;
    }

    public List<RespostaEntity> getRespostas() {
        return respostas;
    }

    public void setRespostas(List<RespostaEntity> respostas) {
        if (respostas == null) {
            this.respostas = new ArrayList<>();
        } else {
            this.respostas = respostas;
        }
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public void setStatus(StatusSolicitacao status) {
        if (status == null) {
            throw new IllegalArgumentException("O status não pode ser nulo.");
        }
        this.status = status;
    }

    public LocalDateTime getDataSolicitacao() {
        return dataSolicitacao;
    }

    public void setDataSolicitacao(LocalDateTime dataSolicitacao) {
        if (dataSolicitacao == null) {
            throw new IllegalArgumentException("A data da solicitação não pode ser nula.");
        }
        this.dataSolicitacao = dataSolicitacao;
    }
}