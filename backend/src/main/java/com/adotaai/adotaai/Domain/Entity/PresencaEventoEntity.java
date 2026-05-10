package com.adotaai.adotaai.Domain.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.util.UUID;

@Entity
@Table(
        name = "PRESENCA_EVENTO",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_presenca_evento_user", columnNames = {"evento_id", "user_id"})
        }
)
public class PresencaEventoEntity extends AuditableEntity {

    @Id
    @GeneratedValue
    @Column(nullable = false, unique = true)
    private UUID id;

    @ManyToOne
    @JoinColumn(
            name = "evento_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_presenca_evento",
                    foreignKeyDefinition = "FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE"
            )
    )
    private EventoEntity evento;

    @ManyToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_presenca_user",
                    foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE"
            )
    )
    private UsuarioEntity usuario;

    public PresencaEventoEntity() {
    }

    public PresencaEventoEntity(EventoEntity evento, UsuarioEntity usuario) {
        this.evento = evento;
        this.usuario = usuario;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public EventoEntity getEvento() {
        return evento;
    }

    public void setEvento(EventoEntity evento) {
        this.evento = evento;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }
}