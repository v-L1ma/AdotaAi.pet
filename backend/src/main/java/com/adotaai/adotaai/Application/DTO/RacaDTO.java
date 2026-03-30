package com.adotaai.adotaai.Application.DTO;

import com.adotaai.adotaai.Domain.Entity.RacaEntity;

import java.util.UUID;

public class RacaDTO {

    private UUID id;
    private String nome;
    private String especie;

    public RacaDTO() {
    }

    public RacaDTO(RacaEntity racaEntity) {
        this.id = racaEntity.getId();
        this.nome = racaEntity.getNome();
        this.especie = racaEntity.getEspecie();
    }

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

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }
}
