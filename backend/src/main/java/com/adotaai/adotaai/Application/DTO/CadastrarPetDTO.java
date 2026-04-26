package com.adotaai.adotaai.Application.DTO;

import java.time.LocalDate;

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

    @NotBlank
    private String raca;

    @NotBlank
    private String especie;

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

    
}