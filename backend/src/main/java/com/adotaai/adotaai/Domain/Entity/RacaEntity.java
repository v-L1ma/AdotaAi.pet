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
        name = "racas",
        uniqueConstraints = {
        @UniqueConstraint(name = "uk_racas_nome_especie", columnNames = {"nome", "especie_id"})
        }
)
public class RacaEntity extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String nome;

        @ManyToOne
        @JoinColumn(name = "especie_id", nullable = false, foreignKey = @ForeignKey(name = "especie_id",
            foreignKeyDefinition = "FOREIGN KEY (especie_id) REFERENCES especies(id)"))
        private EspecieEntity especie;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public EspecieEntity getEspecie() {
        return especie;
    }

    public void setEspecie(EspecieEntity especie) {
        this.especie = especie;
    }

    public UUID getEspecieId() {
        return especie != null ? especie.getId() : null;
    }
}
