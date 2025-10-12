package com.adotaai.adotaai.DTO;

import com.adotaai.adotaai.Entity.PetEntity;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class PetDTO {

    private Long id;
    private String status = "PENDENTE";
    private String descricao;
    private Date dt_nasc;
    private String nome;
    private String porte;
    private String raca;
    private String especie;
    private String link_foto;

    @JsonProperty("user_id")
    private Long user_id;

    public PetDTO(PetEntity pet) {
        this.id = pet.getId();
        this.status = pet.getStatus();
        this.descricao = pet.getDescricao();
        this.dt_nasc = pet.getDt_nasc();
        this.nome = pet.getNome();
        this.porte = pet.getPorte();
        this.raca = pet.getRaca();
        this.especie = pet.getEspecie();
        this.link_foto = pet.getLink_foto();

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Date getDt_nasc() {
        return dt_nasc;
    }

    public void setDt_nasc(Date dt_nasc) {
        this.dt_nasc = dt_nasc;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getLink_foto() {
        return link_foto;
    }

    public void setLink_foto(String link_foto) {
        this.link_foto = link_foto;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }
}
