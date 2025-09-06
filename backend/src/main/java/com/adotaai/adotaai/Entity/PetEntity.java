package com.adotaai.adotaai.Entity;

import com.adotaai.adotaai.DTO.PetDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.beans.BeanUtils;

import java.util.Objects;

@Entity
@Table(name = "PET")
public class PetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String idade;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Boolean adotado = false;

    @Column(nullable = false)
    private Boolean vacinado;

    @Column(nullable = false)
    private String porte;

    @Column(nullable = false)
    private String raca;

    @Column(nullable = false)
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UsuarioEntity user;


    public PetEntity (PetDTO petDTO)
    {
        BeanUtils.copyProperties(petDTO,this);
    }

    public PetEntity() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getIdade() {
        return idade;
    }

    public void setIdade(String idade) {
        this.idade = idade;
    }

    public String getPorte() {
        return porte;
    }

    public void setPorte(String porte) {
        this.porte = porte;
    }

    public String getRaca() {
        return raca;
    }

    public void setRaca(String raca) {
        this.raca = raca;
    }

    public Boolean getVacinado() {
        return vacinado;
    }

    public void setVacinado(Boolean vacinado) {
        this.vacinado = vacinado;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Boolean getAdotado() {
        return adotado;
    }

    public void setAdotado(Boolean adotado) {
        this.adotado = adotado;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        PetEntity petEntity = (PetEntity) o;
        return Objects.equals(id, petEntity.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    public UsuarioEntity getUser() {
        return user;
    }

    public void setUser(UsuarioEntity user) {
        this.user = user;
    }
}
