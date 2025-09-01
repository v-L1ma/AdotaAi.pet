package com.adotaai.adotaai.DTO;

import com.adotaai.adotaai.Entity.PetEntity;
import org.springframework.beans.BeanUtils;

public class PetDTO {

    private Long id;
    private String tipo;
    private Boolean adotado = false;
    private String nome;
    private String idade;
    private String porte;
    private String raca;

    public PetDTO(PetEntity pet) {
        BeanUtils.copyProperties(pet, this);
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

    public Boolean getAdotado() {
        return adotado;
    }

    public void setAdotado(Boolean adotado) {
        this.adotado = adotado;
    }
}
