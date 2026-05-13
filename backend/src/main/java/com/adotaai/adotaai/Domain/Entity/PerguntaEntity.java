package com.adotaai.adotaai.Domain.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "perguntas")
public class PerguntaEntity extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(length = 200, nullable = false)
    private String texto;

    @JsonBackReference("formulario-perguntas")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formulario_id", nullable = false)
    private FormularioEntity formulario;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            throw new IllegalArgumentException("O texto da pergunta não pode estar vazio.");
        }
        if (texto.length() > 200) {
            throw new IllegalArgumentException("O texto da pergunta deve conter no máximo 200 caracteres.");
        }
        this.texto = texto;
    }

    public FormularioEntity getFormulario() {
        return formulario;
    }

    public void setFormulario(FormularioEntity formulario) {
        this.formulario = formulario;
    }
}