package com.adotaai.adotaai.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formularios")
public class FormularioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_criador_id", nullable = false)
    private UsuarioEntity usuarioCriador;

    @JsonManagedReference("formulario-perguntas")
    @OneToMany(mappedBy = "formulario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PerguntaEntity> perguntas = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UsuarioEntity getUsuarioCriador() {
        return usuarioCriador;
    }

    public void setUsuarioCriador(UsuarioEntity usuarioCriador) {
        this.usuarioCriador = usuarioCriador;
    }

    public List<PerguntaEntity> getPerguntas() {
        return perguntas;
    }

    public void setPerguntas(List<PerguntaEntity> perguntas) {
        this.perguntas = perguntas;
    }
}