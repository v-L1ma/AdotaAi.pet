package com.adotaai.adotaai.Application.DTO;

import com.adotaai.adotaai.Domain.Entity.PetEntity;
import com.adotaai.adotaai.Domain.Enum.Status;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time. LocalDate;
import java.util.UUID;

public class PetDTO {

    private UUID id;
    private String status = Status.PENDENTE.name();
    private String descricao;
    private  LocalDate dt_nasc;
    private String nome;
    private String porte;
    private String raca;
    private UUID racaId;
    private String especie;
    private String link_foto;
    private UUID formularioId;
    private String mensagemReprovado;

    @JsonProperty(value = "user_id", access = JsonProperty.Access.READ_ONLY)
    private UUID user_id;

    public PetDTO(PetEntity pet) {
        this.id = pet.getId();
        this.status = pet.getStatus();
        this.descricao = pet.getDescricao();
        this.dt_nasc = pet.getDt_nasc();
        this.nome = pet.getNome();
        this.porte = pet.getPorte();
        this.raca = pet.getRaca();
        if (pet.getRacaEntity() != null) {
            this.racaId = pet.getRacaEntity().getId();
        }
        this.especie = pet.getEspecie();
        this.link_foto = pet.getLink_foto();
        if (pet.getFormulario() != null) {
            this.formularioId = pet.getFormulario().getId();
        }

        if (pet.getUser() != null) {
            this.user_id = pet.getUser().getId();
        }
        this.mensagemReprovado = pet.getMensagemReprovado();
    }

    public PetDTO() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
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

    public  LocalDate getDt_nasc() {
        return dt_nasc;
    }

    public void setDt_nasc( LocalDate dt_nasc) {
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

    public UUID getRacaId() {
        return racaId;
    }

    public void setRacaId(UUID racaId) {
        this.racaId = racaId;
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

    public UUID getFormularioId() {
        return formularioId;
    }

    public void setFormularioId(UUID formularioId) {
        this.formularioId = formularioId;
    }

    public UUID getUser_id() {
        return user_id;
    }

    public void setUser_id(UUID user_id) {
        this.user_id = user_id;
    }

    public String getMensagemReprovado() {
        return mensagemReprovado;
    }

    public void setMensagemReprovado(String mensagemReprovado) {
        this.mensagemReprovado = mensagemReprovado;
    }
}
