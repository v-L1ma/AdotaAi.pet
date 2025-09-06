package com.adotaai.adotaai.DTO;

import com.adotaai.adotaai.Entity.PetEntity;
import com.adotaai.adotaai.Entity.UsuarioEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.BeanUtils;

public class PetDTO {

    private Long id;
    private String tipo;
    private boolean adotado = false;
    private String nome;
    private String idade;
    private String porte;
    private String raca;
    private String descricao;
    private boolean vacinado;

    @JsonProperty("user_id")
    private Long user_id;

    public PetDTO(PetEntity pet) {
        this.id = pet.getId();
        this.tipo = pet.getTipo();
        this.adotado = pet.getAdotado();
        this.nome = pet.getNome();
        this.idade = pet.getIdade();
        this.porte = pet.getPorte();
        this.raca = pet.getRaca();
        this.descricao = pet.getDescricao();
        this.vacinado = pet.getVacinado();

        if (pet.getUser() != null) {
            this.user_id = pet.getUser().getId();
        }
    }

    public PetDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public boolean getAdotado() {
        return adotado;
    }

    public void setAdotado(Boolean adotado) {
        this.adotado = adotado;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public boolean getVacinado() {
        return vacinado;
    }

    public void setVacinado(Boolean vacinado) {
        this.vacinado = vacinado;
    }
}
