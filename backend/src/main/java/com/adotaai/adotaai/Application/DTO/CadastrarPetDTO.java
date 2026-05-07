package com.adotaai.adotaai.Application.DTO;

import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CadastrarPetDTO {

    @NotBlank
    private String nome;

    @NotBlank
    private String descricao;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonAlias({ "dt_nasc", "dtNasc" })
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @NotNull
    private String dtNasc;

    @NotBlank
    private String porte;

    @NotNull
    private UUID racaId;

    @NotNull
    private UUID especieId;

    private UUID formularioId;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getDtNasc() {
        return dtNasc;
    }

    public void setDtNasc(String dtNasc) {
        this.dtNasc = dtNasc;
    }

    public String getPorte() {
        return porte;
    }

    public void setPorte(String porte) {
        this.porte = porte;
    }

    public UUID getRacaId() {
        return racaId;
    }

    public void setRacaId(UUID racaId) {
        this.racaId = racaId;
    }

    public UUID getEspecieId() {
        return especieId;
    }

    public void setEspecieId(UUID especieId) {
        this.especieId = especieId;
    }

    public UUID getFormularioId() {
        return formularioId;
    }

    public void setFormularioId(UUID formularioId) {
        this.formularioId = formularioId;
    }

    
}