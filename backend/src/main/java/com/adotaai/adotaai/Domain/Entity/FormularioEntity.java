package com.adotaai.adotaai.Domain.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "formularios")
public class FormularioEntity extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_criador_id", nullable = false)
    private UsuarioEntity usuarioCriador;

    @JsonManagedReference("formulario-perguntas")
    @OneToMany(mappedBy = "formulario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PerguntaEntity> perguntas = new ArrayList<>();

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UsuarioEntity getUsuarioCriador() {
        return usuarioCriador;
    }

    public void setUsuarioCriador(UsuarioEntity usuarioCriador) {
        if (usuarioCriador == null) {
            throw new IllegalArgumentException("O usuário criador não pode ser nulo.");
        }
        this.usuarioCriador = usuarioCriador;
    }

    public List<PerguntaEntity> getPerguntas() {
        return perguntas;
    }

    public void setPerguntas(List<PerguntaEntity> perguntas) {
        if (perguntas == null) {
            this.perguntas = new ArrayList<>();
        } else {
            this.perguntas = perguntas;
        }
    }
}