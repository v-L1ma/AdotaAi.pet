package com.adotaai.adotaai.Application.DTO;

import com.adotaai.adotaai.Domain.Entity.RacaEntity;

import java.util.UUID;

public class RacaDTO {

    private UUID id;
    private String nome;
    private UUID especieId;

    public RacaDTO() {
    }

    public RacaDTO(RacaEntity racaEntity) {
        this.id = racaEntity.getId();
        this.nome = racaEntity.getNome();
        this.especieId = racaEntity.getEspecieId();
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

    public UUID getEspecieId() {
        return especieId;
    }

    public void setEspecieId(UUID especieId) {
        this.especieId = especieId;
    }
}
