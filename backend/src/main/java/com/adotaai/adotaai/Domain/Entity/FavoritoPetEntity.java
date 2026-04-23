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
        name = "FAVORITO_PET",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_favorito_user_pet", columnNames = {"user_id", "pet_id"})
        }
)
public class FavoritoPetEntity extends AuditableEntity {

    @Id
    @GeneratedValue
    @Column(nullable = false, unique = true)
    private UUID id;

    @ManyToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_favorito_user",
                    foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE"
            )
    )
    private UsuarioEntity usuario;

    @ManyToOne
    @JoinColumn(
            name = "pet_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_favorito_pet",
                    foreignKeyDefinition = "FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE"
            )
    )
    private PetEntity pet;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }

    public PetEntity getPet() {
        return pet;
    }

    public void setPet(PetEntity pet) {
        this.pet = pet;
    }
}
